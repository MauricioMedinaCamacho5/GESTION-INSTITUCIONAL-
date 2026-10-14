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
        $res = $client->select('institutional_users', '*', [], 'full_name.asc');
        if (!$res['error'] && is_array($res['data'])) {
            $isFromSupabase = true;
            foreach ($res['data'] as $r) {
                $items[] = [
                    'id' => $r['id'],
                    'fullName' => $r['full_name'],
                    'doc' => $r['doc'],
                    'role' => $r['role'],
                    'email' => $r['email'],
                    'program' => $r['program'],
                    'carnetCode' => $r['carnet_code'],
                    'carnetStatus' => $r['carnet_status'],
                    'photoUrl' => $r['photo_url'],
                    'authorizedEquipment' => $r['authorized_equipment']
                ];
            }
        }
    }

    if (!$isFromSupabase) {
        $local = getLocalStorage();
        $items = $local['users'] ?? [];
    }

    echo json_encode([
        'error' => false,
        'source' => $isFromSupabase ? 'supabase' : 'local',
        'data' => $items
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['fullName']) || empty($input['doc'])) {
        echo json_encode(['error' => true, 'message' => 'Nombre y documento requeridos']);
        exit;
    }

    $id = 'usr-' . time();
    $role = trim($input['role'] ?? 'ESTUDIANTE');
    $prefix = $role === 'ESTUDIANTE' ? 'EST' : ($role === 'INSTRUCTOR' ? 'DOC' : 'ADM');
    $carnetCode = !empty($input['carnetCode']) ? trim($input['carnetCode']) : 'CARNET-' . date('Y') . "-{$prefix}-" . rand(100, 999);

    $newUser = [
        'id' => $id,
        'fullName' => trim($input['fullName']),
        'doc' => trim($input['doc']),
        'role' => $role,
        'email' => trim($input['email'] ?? strtolower(str_replace(' ', '.', $input['fullName'])) . '@instituto.edu.co'),
        'program' => trim($input['program'] ?? 'Programa General'),
        'carnetCode' => $carnetCode,
        'carnetStatus' => 'ACTIVO',
        'photoUrl' => trim($input['photoUrl'] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw'),
        'authorizedEquipment' => trim($input['authorizedEquipment'] ?? 'Sin equipos registrados')
    ];

    $savedSupabase = false;
    if (isSupabaseConfigured()) {
        $row = [
            'id' => $newUser['id'],
            'full_name' => $newUser['fullName'],
            'doc' => $newUser['doc'],
            'role' => $newUser['role'],
            'email' => $newUser['email'],
            'program' => $newUser['program'],
            'carnet_code' => $newUser['carnetCode'],
            'carnet_status' => $newUser['carnetStatus'],
            'photo_url' => $newUser['photoUrl'],
            'authorized_equipment' => $newUser['authorizedEquipment']
        ];
        $res = $client->insert('institutional_users', $row);
        if (!$res['error']) {
            $savedSupabase = true;
        }
    }

    $local = getLocalStorage();
    array_unshift($local['users'], $newUser);
    saveLocalStorage($local);

    echo json_encode([
        'error' => false,
        'message' => 'Usuario y Carnet Digital creados correctamente',
        'source' => $savedSupabase ? 'supabase' : 'local',
        'data' => $newUser
    ]);
    exit;
}

echo json_encode(['error' => true, 'message' => 'Método no soportado']);
exit;
