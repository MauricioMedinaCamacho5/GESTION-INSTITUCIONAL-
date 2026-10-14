<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
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
        $res = $client->select('asset_records', '*', [], 'created_at.desc');
        if (!$res['error'] && is_array($res['data'])) {
            $isFromSupabase = true;
            foreach ($res['data'] as $r) {
                $items[] = [
                    'id' => $r['id'],
                    'qrCode' => $r['qr_code'],
                    'category' => $r['category'],
                    'title' => $r['title'],
                    'specs' => $r['specs'],
                    'serial' => $r['serial'],
                    'mac' => $r['mac'],
                    'custodianName' => $r['custodian_name'],
                    'custodianDocOrFicha' => $r['custodian_doc_or_ficha'],
                    'custodianInitials' => $r['custodian_initials'],
                    'custodianRole' => $r['custodian_role'],
                    'statusTag' => $r['status_tag'],
                    'deadlineNotice' => $r['deadline_notice'],
                    'deadlineType' => $r['deadline_type']
                ];
            }
        }
    }

    if (!$isFromSupabase) {
        $local = getLocalStorage();
        $items = $local['assets'] ?? [];
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
    if (!$input || empty($input['title']) || empty($input['serial'])) {
        echo json_encode(['error' => true, 'message' => 'Título y serial requeridos']);
        exit;
    }

    $id = 'ast-' . time();
    $qrCode = !empty($input['qrCode']) ? trim($input['qrCode']) : 'ACT-GEN-' . rand(1000, 9999);

    $newAsset = [
        'id' => $id,
        'qrCode' => $qrCode,
        'category' => trim($input['category'] ?? 'Activo Fijo'),
        'title' => trim($input['title']),
        'specs' => trim($input['specs'] ?? ''),
        'serial' => trim($input['serial']),
        'mac' => trim($input['mac'] ?? 'N/A'),
        'custodianName' => trim($input['custodianName'] ?? 'Sin Asignar'),
        'custodianDocOrFicha' => trim($input['custodianDocOrFicha'] ?? 'Almacén Central'),
        'custodianInitials' => trim($input['custodianInitials'] ?? 'AC'),
        'custodianRole' => trim($input['custodianRole'] ?? 'Almacén'),
        'statusTag' => trim($input['statusTag'] ?? 'En Sede / Fijo'),
        'deadlineNotice' => trim($input['deadlineNotice'] ?? ''),
        'deadlineType' => trim($input['deadlineType'] ?? 'normal')
    ];

    $savedSupabase = false;
    if (isSupabaseConfigured()) {
        $row = [
            'id' => $newAsset['id'],
            'qr_code' => $newAsset['qrCode'],
            'category' => $newAsset['category'],
            'title' => $newAsset['title'],
            'specs' => $newAsset['specs'],
            'serial' => $newAsset['serial'],
            'mac' => $newAsset['mac'],
            'custodian_name' => $newAsset['custodianName'],
            'custodian_doc_or_ficha' => $newAsset['custodianDocOrFicha'],
            'custodian_initials' => $newAsset['custodianInitials'],
            'custodian_role' => $newAsset['custodianRole'],
            'status_tag' => $newAsset['statusTag'],
            'deadline_notice' => $newAsset['deadlineNotice'],
            'deadline_type' => $newAsset['deadlineType']
        ];
        $res = $client->insert('asset_records', $row);
        if (!$res['error']) {
            $savedSupabase = true;
        }
    }

    $local = getLocalStorage();
    array_unshift($local['assets'], $newAsset);
    saveLocalStorage($local);

    echo json_encode([
        'error' => false,
        'message' => 'Activo registrado exitosamente',
        'source' => $savedSupabase ? 'supabase' : 'local',
        'data' => $newAsset
    ]);
    exit;
}

if ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['id'])) {
        echo json_encode(['error' => true, 'message' => 'ID de activo requerido']);
        exit;
    }

    $id = trim($input['id']);
    $updates = [];
    $supabaseUpdates = [];

    if (isset($input['statusTag'])) {
        $updates['statusTag'] = trim($input['statusTag']);
        $supabaseUpdates['status_tag'] = trim($input['statusTag']);
    }
    if (isset($input['custodianName'])) {
        $updates['custodianName'] = trim($input['custodianName']);
        $supabaseUpdates['custodian_name'] = trim($input['custodianName']);
    }
    if (isset($input['deadlineNotice'])) {
        $updates['deadlineNotice'] = trim($input['deadlineNotice']);
        $supabaseUpdates['deadline_notice'] = trim($input['deadlineNotice']);
    }
    if (isset($input['deadlineType'])) {
        $updates['deadlineType'] = trim($input['deadlineType']);
        $supabaseUpdates['deadline_type'] = trim($input['deadlineType']);
    }

    $savedSupabase = false;
    if (isSupabaseConfigured() && !empty($supabaseUpdates)) {
        $res = $client->update('asset_records', $supabaseUpdates, ['id' => 'eq.' . $id]);
        if (!$res['error']) {
            $savedSupabase = true;
        }
    }

    $local = getLocalStorage();
    $found = false;
    if (!empty($local['assets'])) {
        foreach ($local['assets'] as &$a) {
            if ($a['id'] === $id) {
                foreach ($updates as $k => $v) {
                    $a[$k] = $v;
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
        'message' => 'Activo actualizado',
        'source' => $savedSupabase ? 'supabase' : 'local'
    ]);
    exit;
}

echo json_encode(['error' => true, 'message' => 'Método no soportado']);
exit;
