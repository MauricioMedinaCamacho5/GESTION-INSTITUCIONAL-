<?php
require_once dirname(__DIR__) . '/config.php';

/**
 * Cliente PHP ligero para Supabase REST API (PostgREST)
 */
class SupabaseClient {
    private $url;
    private $key;
    private $timeout;

    public function __construct($url = null, $key = null, $timeout = 10) {
        $this->url = $url ? rtrim($url, '/') : SUPABASE_URL;
        $this->key = $key ? trim($key) : SUPABASE_KEY;
        $this->timeout = $timeout;
    }

    public function isConfigured() {
        return !empty($this->url) && !empty($this->key);
    }

    /**
     * Realiza una petición cURL a la API REST de Supabase
     */
    private function request($method, $endpoint, $data = null, $queryParams = [], $extraHeaders = []) {
        if (!$this->isConfigured()) {
            return ['error' => true, 'message' => 'Supabase no está configurado (URL o API Key faltante)', 'status' => 0];
        }

        $fullUrl = $this->url . '/rest/v1/' . ltrim($endpoint, '/');
        if (!empty($queryParams)) {
            $queryString = http_build_query($queryParams);
            $fullUrl .= (strpos($fullUrl, '?') === false ? '?' : '&') . $queryString;
        }

        $headers = array_merge([
            'apikey: ' . $this->key,
            'Authorization: Bearer ' . $this->key,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ], $extraHeaders);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $fullUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        // Compatibilidad para entornos XAMPP Windows que carecen de cacert.pem actualizado
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        if ($data !== null) {
            $payload = is_string($data) ? $data : json_encode($data, JSON_UNESCAPED_UNICODE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            return [
                'error' => true,
                'message' => 'Error de conexión cURL: ' . $curlError,
                'status' => 500
            ];
        }

        $decoded = json_decode($response, true);
        if ($httpCode >= 200 && $httpCode < 300) {
            return [
                'error' => false,
                'data' => $decoded,
                'status' => $httpCode
            ];
        }

        $errorMsg = is_array($decoded) && isset($decoded['message']) ? $decoded['message'] : 'Error en Supabase (HTTP ' . $httpCode . ')';
        return [
            'error' => true,
            'message' => $errorMsg,
            'details' => $decoded,
            'status' => $httpCode
        ];
    }

    /**
     * SELECT (Consultar registros)
     */
    public function select($table, $select = '*', $filters = [], $order = null, $limit = null) {
        $params = ['select' => $select];
        foreach ($filters as $col => $val) {
            $params[$col] = $val;
        }
        if ($order) {
            $params['order'] = $order;
        }
        if ($limit) {
            $params['limit'] = $limit;
        }

        return $this->request('GET', $table, null, $params);
    }

    /**
     * INSERT (Crear registro o múltiples registros)
     */
    public function insert($table, $data) {
        return $this->request('POST', $table, $data);
    }

    /**
     * UPDATE / PATCH (Actualizar registros)
     */
    public function update($table, $data, $filters = []) {
        return $this->request('PATCH', $table, $data, $filters);
    }

    /**
     * DELETE (Eliminar registros)
     */
    public function delete($table, $filters = []) {
        return $this->request('DELETE', $table, null, $filters);
    }

    /**
     * Probar conexión con Supabase y verificar tablas
     */
    public function testConnection() {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'message' => 'Supabase URL o API Key están vacíos.'
            ];
        }

        $startTime = microtime(true);
        // Probar acceso a access_logs o endpoint raíz
        $res = $this->request('GET', 'access_logs', null, ['select' => 'id', 'limit' => 1]);
        $duration = round((microtime(true) - $startTime) * 1000, 1);

        if (!$res['error']) {
            return [
                'success' => true,
                'message' => 'Conexión exitosa a Supabase PostgREST.',
                'latency_ms' => $duration,
                'table_found' => true
            ];
        }

        // Si la tabla no existe aún (código 404 o mensaje relation does not exist)
        if ($res['status'] === 404 || (isset($res['details']['code']) && $res['details']['code'] === '42P01')) {
            return [
                'success' => true,
                'message' => 'Conectado a Supabase, pero falta ejecutar el script database/schema.sql para crear las tablas.',
                'latency_ms' => $duration,
                'table_found' => false,
                'need_schema' => true
            ];
        }

        return [
            'success' => false,
            'message' => 'Fallo al conectar con Supabase: ' . $res['message'],
            'status' => $res['status'],
            'latency_ms' => $duration
        ];
    }
}
