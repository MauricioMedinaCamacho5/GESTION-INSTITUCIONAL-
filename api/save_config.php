<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['error' => true, 'message' => 'Entrada inválida']);
    exit;
}

$url = isset($input['supabase_url']) ? trim($input['supabase_url']) : '';
$key = isset($input['supabase_key']) ? trim($input['supabase_key']) : '';

$currentConfig = [];
if (file_exists(CONFIG_FILE)) {
    $currentConfig = json_decode(file_get_contents(CONFIG_FILE), true) ?: [];
}

$currentConfig['supabase_url'] = $url;
$currentConfig['supabase_key'] = $key;

if (isset($input['campus_name'])) {
    $currentConfig['campus_name'] = trim($input['campus_name']);
}
if (isset($input['security_level'])) {
    $currentConfig['security_level'] = trim($input['security_level']);
}

$saved = file_put_contents(CONFIG_FILE, json_encode($currentConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($saved !== false) {
    // Probar si las nuevas credenciales son funcionales
    $client = new SupabaseClient($url, $key);
    $test = $client->testConnection();

    echo json_encode([
        'error' => false,
        'message' => 'Configuración guardada correctamente.',
        'test' => $test
    ]);
} else {
    echo json_encode(['error' => true, 'message' => 'No se pudo escribir en ' . CONFIG_FILE]);
}
exit;
