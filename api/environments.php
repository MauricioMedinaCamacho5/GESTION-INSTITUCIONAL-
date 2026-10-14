<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PATCH, OPTIONS');
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
        $res = $client->select('training_environments', '*', [], 'code.asc');
        if (!$res['error'] && is_array($res['data'])) {
            $isFromSupabase = true;
            foreach ($res['data'] as $r) {
                $tags = is_string($r['equipment_tags']) ? json_decode($r['equipment_tags'], true) : $r['equipment_tags'];
                $items[] = [
                    'id' => $r['id'],
                    'code' => $r['code'],
                    'name' => $r['name'],
                    'location' => $r['location'],
                    'status' => $r['status'],
                    'capacity' => (int)$r['capacity'],
                    'currentAttendance' => (int)($r['current_attendance'] ?? 0),
                    'scheduleTime' => $r['schedule_time'],
                    'currentSubject' => $r['current_subject'],
                    'instructor' => $r['instructor'],
                    'equipmentTags' => is_array($tags) ? $tags : [],
                    'nextSubjectNotice' => $r['next_subject_notice'],
                    'doorStatus' => $r['door_status'],
                    'accentColor' => $r['accent_color']
                ];
            }
        }
    }

    if (!$isFromSupabase) {
        $local = getLocalStorage();
        $items = $local['environments'] ?? [];
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
        echo json_encode(['error' => true, 'message' => 'ID de ambiente requerido']);
        exit;
    }

    $id = trim($input['id']);
    $updates = [];
    $supabaseUpdates = [];

    if (isset($input['doorStatus'])) {
        $updates['doorStatus'] = trim($input['doorStatus']);
        $supabaseUpdates['door_status'] = trim($input['doorStatus']);
    }
    if (isset($input['status'])) {
        $updates['status'] = trim($input['status']);
        $supabaseUpdates['status'] = trim($input['status']);
    }
    if (isset($input['currentAttendance'])) {
        $updates['currentAttendance'] = (int)$input['currentAttendance'];
        $supabaseUpdates['current_attendance'] = (int)$input['currentAttendance'];
    }

    $savedSupabase = false;
    if (isSupabaseConfigured() && !empty($supabaseUpdates)) {
        $res = $client->update('training_environments', $supabaseUpdates, ['id' => 'eq.' . $id]);
        if (!$res['error']) {
            $savedSupabase = true;
        }
    }

    $local = getLocalStorage();
    $found = false;
    if (!empty($local['environments'])) {
        foreach ($local['environments'] as &$e) {
            if ($e['id'] === $id) {
                foreach ($updates as $k => $v) {
                    $e[$k] = $v;
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
        'message' => 'Ambiente actualizado correctamente',
        'source' => $savedSupabase ? 'supabase' : 'local'
    ]);
    exit;
}

echo json_encode(['error' => true, 'message' => 'Método no soportado']);
exit;
