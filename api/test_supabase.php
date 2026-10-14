<?php
require_once dirname(__DIR__) . '/config.php';
require_once __DIR__ . '/SupabaseClient.php';

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);

$url = isset($input['supabase_url']) ? trim($input['supabase_url']) : SUPABASE_URL;
$key = isset($input['supabase_key']) ? trim($input['supabase_key']) : SUPABASE_KEY;

$client = new SupabaseClient($url, $key);
$result = $client->testConnection();

$result['supabase_url'] = !empty($url) ? $url : 'No configurado';
$result['is_active_config'] = isSupabaseConfigured();

echo json_encode($result, JSON_UNESCAPED_UNICODE);
exit;
