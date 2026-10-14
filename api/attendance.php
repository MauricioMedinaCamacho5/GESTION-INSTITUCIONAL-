<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit;
}

$client = new SupabaseClient();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $items = [];
    $isFromSupabase = false;

    if (isSupabaseConfigured()) {
        $res = $client->select('students_attendance', '*', [], 'number.asc', 100);
        if (!$res['error'] && is_array($res['data'])) {
            $isFromSupabase = true;
            foreach ($res['data'] as $r) {
                $items[] = [
                    'id' => $r['id'],
                    'number' => $r['number'],
                    'name' => $r['name'],
                    'email' => $r['email'],
                    'doc' => $r['doc'],
                    'status' => $r['status'],
                    'checkTime' => $r['check_time'],
                    'delayMinutes' => (int)($r['delay_minutes'] ?? 0),
                    'deviceType' => $r['device_type'],
                    'notes' => $r['notes'],
                    'avatarUrl' => $r['avatar_url'],
                    'linkedDevice' => $r['linked_device'],
                    'excuseId' => $r['excuse_id']
                ];
            }
        }
    }

    if (!$isFromSupabase) {
        $local = getLocalStorage();
        $items = $local['students'] ?? [];
    }

    echo json_encode([
        'error' => false,
        'source' => $isFromSupabase ? 'supabase' : 'local',
        'data' => $items
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['id'])) {
        echo json_encode(['error' => true, 'message' => 'ID de estudiante requerido']);
        exit;
    }

    $id = trim($input['id']);
    $updates = [];
    $supabaseUpdates = [];

    if (isset($input['status'])) {
        $status = strtoupper(trim($input['status']));
        if (in_array($status, ['P', 'R', 'J', 'F'])) {
            $updates['status'] = $status;
            $supabaseUpdates['status'] = $status;
        }
    }
    if (isset($input['notes'])) {
        $updates['notes'] = trim($input['notes']);
        $supabaseUpdates['notes'] = trim($input['notes']);
    }
    if (isset($input['checkTime'])) {
        $updates['checkTime'] = trim($input['checkTime']);
        $supabaseUpdates['check_time'] = trim($input['checkTime']);
    }
    if (isset($input['delayMinutes'])) {
        $updates['delayMinutes'] = (int)$input['delayMinutes'];
        $supabaseUpdates['delay_minutes'] = (int)$input['delayMinutes'];
    }
    if (isset($input['deviceType'])) {
        $updates['deviceType'] = trim($input['deviceType']);
        $supabaseUpdates['device_type'] = trim($input['deviceType']);
    }

    $savedSupabase = false;
    if (isSupabaseConfigured() && !empty($supabaseUpdates)) {
        $res = $client->update('students_attendance', $supabaseUpdates, ['id' => 'eq.' . $id]);
        if (!$res['error']) {
            $savedSupabase = true;
        }
    }

    // Actualizar local storage
    $local = getLocalStorage();
    $found = false;
    if (!empty($local['students'])) {
        foreach ($local['students'] as &$s) {
            if ($s['id'] === $id) {
                foreach ($updates as $k => $v) {
                    $s[$k] = $v;
                }
                $found = true;
                break;
            }
        }
        if ($found) {
            saveLocalStorage($local);
        }
    }

    echo json_encode([
        'error' => false,
        'message' => 'Asistencia actualizada correctamente',
        'source' => $savedSupabase ? 'supabase' : 'local'
    ]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['name']) || empty($input['doc'])) {
        echo json_encode(['error' => true, 'message' => 'Nombre y documento requeridos']);
        exit;
    }

    $local = getLocalStorage();
    $nextNumber = str_pad(count($local['students'] ?? []) + 1, 2, '0', STR_PAD_LEFT);
    $newStudent = [
        'id' => 'std-' . time(),
        'number' => $nextNumber,
        'name' => trim($input['name']),
        'email' => trim($input['email'] ?? strtolower(str_replace(' ', '.', $input['name'])) . '@instituto.edu.co'),
        'doc' => trim($input['doc']),
        'status' => 'P',
        'checkTime' => date('h:i A'),
        'delayMinutes' => 0,
        'deviceType' => 'Manual (Profesor)',
        'notes' => 'Agregado manualmente en sesión',
        'avatarUrl' => trim($input['avatarUrl'] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBud5vIHRRnirhtrVE_-KGB0305ObGZOvJ9LZEuP5ejbkkoUwBzZjMMyMl-hVV5p5m2CrNcOu3HwR5zncZ_F8pnn9xmuf59BLYi5crs1A35Lr5SRfNH9xjZ7G8Kwg6MsG9U69GLv55zIt-6YASdAJwgWNe544eObVX-kTiWRFkYP4VJao_H2SrSE5MlWcy72eyCEHeTArkSFMmXnC89fZL_IkVA-GOr0oulTYrugOqKTSHJKmoAhybVzQ'),
        'linkedDevice' => trim($input['linkedDevice'] ?? ''),
        'excuseId' => ''
    ];

    if (isSupabaseConfigured()) {
        $row = [
            'id' => $newStudent['id'],
            'number' => $newStudent['number'],
            'name' => $newStudent['name'],
            'email' => $newStudent['email'],
            'doc' => $newStudent['doc'],
            'status' => $newStudent['status'],
            'check_time' => $newStudent['checkTime'],
            'delay_minutes' => 0,
            'device_type' => $newStudent['deviceType'],
            'notes' => $newStudent['notes'],
            'avatar_url' => $newStudent['avatarUrl'],
            'linked_device' => $newStudent['linkedDevice']
        ];
        $client->insert('students_attendance', $row);
    }

    $local['students'][] = $newStudent;
    saveLocalStorage($local);

    echo json_encode([
        'error' => false,
        'message' => 'Estudiante añadido a la lista',
        'data' => $newStudent
    ]);
    exit;
}

echo json_encode(['error' => true, 'message' => 'Método no soportado']);
exit;
