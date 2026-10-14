<?php
/**
 * SISTEMA DE GESTIÓN INSTITUCIONAL (SGI ACCESO)
 * Archivo de Configuración General & Supabase
 */

// Desactivar visualización de errores directos en salida JSON
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Zona horaria institucional
date_default_timezone_set('America/Bogota');

// Rutas base
define('BASE_PATH', dirname(__FILE__));
define('DATA_DIR', BASE_PATH . DIRECTORY_SEPARATOR . 'data');
define('CONFIG_FILE', BASE_PATH . DIRECTORY_SEPARATOR . 'config.json');
define('LOCAL_STORAGE_FILE', DATA_DIR . DIRECTORY_SEPARATOR . 'local_storage.json');

// Valores por defecto
$defaultConfig = [
    'supabase_url' => '',
    'supabase_key' => '',
    'institution_name' => 'SGI Acceso - Control Institucional',
    'campus_name' => 'Campus Central: Puerta Principal',
    'app_version' => '2.5.0-PHP',
    'security_level' => 'NORMAL'
];

// Cargar configuración personalizada si existe
$config = $defaultConfig;
if (file_exists(CONFIG_FILE)) {
    $loaded = json_decode(file_get_contents(CONFIG_FILE), true);
    if (is_array($loaded)) {
        $config = array_merge($defaultConfig, $loaded);
    }
}

// Variables de entorno como fallback
if (empty($config['supabase_url']) && getenv('SUPABASE_URL')) {
    $config['supabase_url'] = getenv('SUPABASE_URL');
}
if (empty($config['supabase_key']) && getenv('SUPABASE_KEY')) {
    $config['supabase_key'] = getenv('SUPABASE_KEY');
}

define('SUPABASE_URL', rtrim($config['supabase_url'], '/'));
define('SUPABASE_KEY', trim($config['supabase_key']));

/**
 * Helper para verificar si Supabase está configurado con credenciales válidas
 */
function isSupabaseConfigured() {
    return !empty(SUPABASE_URL) && !empty(SUPABASE_KEY) && strpos(SUPABASE_URL, 'supabase.co') !== false;
}

/**
 * Helper para leer datos del almacenamiento local JSON
 */
function getLocalStorage() {
    if (!file_exists(LOCAL_STORAGE_FILE)) {
        return ['access_logs' => [], 'students' => [], 'environments' => [], 'assets' => [], 'users' => []];
    }
    $raw = file_get_contents(LOCAL_STORAGE_FILE);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : ['access_logs' => [], 'students' => [], 'environments' => [], 'assets' => [], 'users' => []];
}

/**
 * Helper para guardar datos en el almacenamiento local JSON
 */
function saveLocalStorage($data) {
    if (!file_exists(DATA_DIR)) {
        mkdir(DATA_DIR, 0777, true);
    }
    return file_put_contents(LOCAL_STORAGE_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/**
 * Enviar respuesta JSON estándar
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, apikey');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
