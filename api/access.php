<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit;
}

$client = new SupabaseClient();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim(mb_strtolower($_GET['search'])) : '';
    $role = isset($_GET['role']) ? trim($_GET['role']) : '';

    $items = [];
    $isFromSupabase = false;

    if (isSupabaseConfigured()) {
        $filters = [];
        if (!empty($role) && $role !== 'Todos') {
            $filters['role'] = 'eq.' . $role;
        }
        $res = $client->select('access_logs', '*', $filters, 'created_at.desc', 50);
        if (!$res['error'] && is_array($res['data'])) {
            $isFromSupabase = true;
            foreach ($res['data'] as $row) {
                $items[] = [
                    'id' => $row['id'],
                    'time' => $row['time'],
                    'userName' => $row['user_name'],
                    'userDoc' => $row['user_doc'],
                    'role' => $row['role'],
                    'programOrDept' => $row['program_or_dept'],
                    'destination' => $row['destination'],
                    'equipment' => $row['equipment'],
                    'avatarUrl' => $row['avatar_url'],
                    'initials' => $row['initials'],
                    'result' => $row['result'],
                    'isDenied' => (bool)$row['is_denied']
                ];
            }
        }
    }

    // Fallback local si no hay Supabase o falló
    if (!$isFromSupabase) {
        $local = getLocalStorage();
        $items = $local['access_logs'] ?? [];
    }

    // Aplicar filtros en memoria si corresponde
    if (!empty($search) || (!empty($role) && $role !== 'Todos')) {
        $items = array_values(array_filter($items, function($item) use ($search, $role) {
            $matchSearch = true;
            if (!empty($search)) {
                $haystack = mb_strtolower($item['userName'] . ' ' . $item['userDoc'] . ' ' . $item['destination'] . ' ' . $item['equipment']);
                $matchSearch = mb_strpos($haystack, $search) !== false;
            }
            $matchRole = true;
            if (!empty($role) && $role !== 'Todos') {
                $matchRole = ($item['role'] === $role);
            }
            return $matchSearch && $matchRole;
        }));
    }

    echo json_encode([
        'error' => false,
        'source' => $isFromSupabase ? 'supabase' : 'local',
        'count' => count($items),
        'data' => $items
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['userName'])) {
        echo json_encode(['error' => true, 'message' => 'Datos incompletos para registrar acceso']);
        exit;
    }

    $timeStr = !empty($input['time']) ? $input['time'] : date('H:i:s');
    $id = 'ev-' . time() . '-' . rand(100, 999);

    $newLog = [
        'id' => $id,
        'time' => $timeStr,
        'userName' => trim($input['userName']),
        'userDoc' => trim($input['userDoc'] ?? ''),
        'role' => trim($input['role'] ?? 'ESTUDIANTE'),
        'programOrDept' => trim($input['programOrDept'] ?? 'Tecnología en Software'),
        'destination' => trim($input['destination'] ?? 'Lab TIC 302'),
        'equipment' => trim($input['equipment'] ?? 'Sin equipos'),
        'avatarUrl' => trim($input['avatarUrl'] ?? ''),
        'initials' => trim($input['initials'] ?? ''),
        'result' => trim($input['result'] ?? 'INGRESO EXITOSO'),
        'isDenied' => !empty($input['isDenied'])
    ];

    $savedToSupabase = false;
    if (isSupabaseConfigured()) {
        $row = [
            'id' => $newLog['id'],
            'time' => $newLog['time'],
            'user_name' => $newLog['userName'],
            'user_doc' => $newLog['userDoc'],
            'role' => $newLog['role'],
            'program_or_dept' => $newLog['programOrDept'],
            'destination' => $newLog['destination'],
            'equipment' => $newLog['equipment'],
            'avatar_url' => $newLog['avatarUrl'],
            'initials' => $newLog['initials'],
            'result' => $newLog['result'],
            'is_denied' => $newLog['isDenied']
        ];
        $res = $client->insert('access_logs', $row);
        if (!$res['error']) {
            $savedToSupabase = true;
        }
    }

    // Guardar siempre en local storage para sincronía
    $local = getLocalStorage();
    array_unshift($local['access_logs'], $newLog);
    saveLocalStorage($local);

    echo json_encode([
        'error' => false,
        'source' => $savedToSupabase ? 'supabase' : 'local',
        'message' => 'Acceso registrado correctamente',
        'data' => $newLog
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['error' => true, 'message' => 'Método no soportado']);
exit;
