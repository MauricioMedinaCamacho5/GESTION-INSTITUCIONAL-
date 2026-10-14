<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');

if (!isSupabaseConfigured()) {
    echo json_encode(['error' => true, 'message' => 'Supabase no está configurado en config.php / config.json']);
    exit;
}

$localData = getLocalStorage();
$client = new SupabaseClient();

$results = [
    'access_logs' => 0,
    'students' => 0,
    'environments' => 0,
    'assets' => 0,
    'users' => 0,
    'errors' => []
];

// 1. Usuarios
if (!empty($localData['users'])) {
    foreach ($localData['users'] as $u) {
        $row = [
            'id' => $u['id'],
            'full_name' => $u['fullName'],
            'doc' => $u['doc'],
            'role' => $u['role'],
            'email' => $u['email'],
            'program' => $u['program'] ?? '',
            'carnet_code' => $u['carnetCode'],
            'carnet_status' => $u['carnetStatus'] ?? 'ACTIVO',
            'photo_url' => $u['photoUrl'] ?? '',
            'authorized_equipment' => $u['authorizedEquipment'] ?? ''
        ];
        $res = $client->insert('institutional_users', $row);
        if (!$res['error']) {
            $results['users']++;
        }
    }
}

// 2. Registros de acceso
if (!empty($localData['access_logs'])) {
    foreach ($localData['access_logs'] as $log) {
        $row = [
            'id' => $log['id'],
            'time' => $log['time'],
            'user_name' => $log['userName'],
            'user_doc' => $log['userDoc'],
            'role' => $log['role'],
            'program_or_dept' => $log['programOrDept'] ?? '',
            'destination' => $log['destination'] ?? '',
            'equipment' => $log['equipment'] ?? '',
            'avatar_url' => $log['avatarUrl'] ?? '',
            'initials' => $log['initials'] ?? '',
            'result' => $log['result'],
            'is_denied' => !empty($log['isDenied'])
        ];
        $res = $client->insert('access_logs', $row);
        if (!$res['error']) {
            $results['access_logs']++;
        }
    }
}

// 3. Estudiantes y asistencia
if (!empty($localData['students'])) {
    foreach ($localData['students'] as $s) {
        $row = [
            'id' => $s['id'],
            'number' => $s['number'],
            'name' => $s['name'],
            'email' => $s['email'],
            'doc' => $s['doc'],
            'status' => $s['status'],
            'check_time' => $s['checkTime'] ?? '',
            'delay_minutes' => $s['delayMinutes'] ?? 0,
            'device_type' => $s['deviceType'] ?? 'Manual',
            'notes' => $s['notes'] ?? '',
            'avatar_url' => $s['avatarUrl'] ?? '',
            'linked_device' => $s['linkedDevice'] ?? '',
            'excuse_id' => $s['excuseId'] ?? ''
        ];
        $res = $client->insert('students_attendance', $row);
        if (!$res['error']) {
            $results['students']++;
        }
    }
}

// 4. Ambientes
if (!empty($localData['environments'])) {
    foreach ($localData['environments'] as $e) {
        $row = [
            'id' => $e['id'],
            'code' => $e['code'],
            'name' => $e['name'],
            'location' => $e['location'],
            'status' => $e['status'],
            'capacity' => $e['capacity'] ?? 30,
            'current_attendance' => $e['currentAttendance'] ?? 0,
            'schedule_time' => $e['scheduleTime'] ?? '',
            'current_subject' => $e['currentSubject'] ?? '',
            'instructor' => $e['instructor'] ?? '',
            'equipment_tags' => $e['equipmentTags'] ?? [],
            'next_subject_notice' => $e['nextSubjectNotice'] ?? '',
            'door_status' => $e['doorStatus'] ?? 'Puerta Bloqueada',
            'accent_color' => $e['accentColor'] ?? 'primary'
        ];
        $res = $client->insert('training_environments', $row);
        if (!$res['error']) {
            $results['environments']++;
        }
    }
}

// 5. Activos y equipos
if (!empty($localData['assets'])) {
    foreach ($localData['assets'] as $a) {
        $row = [
            'id' => $a['id'],
            'qr_code' => $a['qrCode'],
            'category' => $a['category'],
            'title' => $a['title'],
            'specs' => $a['specs'] ?? '',
            'serial' => $a['serial'] ?? '',
            'mac' => $a['mac'] ?? 'N/A',
            'custodian_name' => $a['custodianName'],
            'custodian_doc_or_ficha' => $a['custodianDocOrFicha'],
            'custodian_initials' => $a['custodianInitials'] ?? '',
            'custodian_role' => $a['custodianRole'] ?? 'Aprendiz',
            'status_tag' => $a['statusTag'],
            'deadline_notice' => $a['deadlineNotice'] ?? '',
            'deadline_type' => $a['deadlineType'] ?? 'normal'
        ];
        $res = $client->insert('asset_records', $row);
        if (!$res['error']) {
            $results['assets']++;
        }
    }
}

echo json_encode([
    'error' => false,
    'message' => 'Sincronización completada hacia Supabase.',
    'summary' => $results
], JSON_UNESCAPED_UNICODE);
exit;
