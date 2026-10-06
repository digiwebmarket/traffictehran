<?php
/**
 * Citibig Transit Proxy Bridge
 * --------------------------------------------------
 * A secure PHP proxy bridge to connect external sites
 * to the Citibig Transit Dashboard REST API.
 */

// 1. UPDATE THIS URL TO YOUR WORDPRESS BACKEND
define('BACKEND_URL', 'https://dev.citibig.com/tehran');

@set_time_limit(0);

$path = $_SERVER['PATH_INFO'] ?? '';
if (empty($path) && isset($_GET['path'])) {
    $path = $_GET['path'];
    unset($_GET['path']); // Remove it so it doesn't get appended twice
}
if (empty($path)) {
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    $script_name = $_SERVER['SCRIPT_NAME'] ?? '';
    if (strpos($request_uri, $script_name) === 0) {
        $path = substr($request_uri, strlen($script_name));
    }
}

if (($pos = strpos($path, '?')) !== false) {
    $path = substr($path, 0, $pos);
}

// Build destination target URL
$query_string = $_SERVER['QUERY_STRING'] ?? '';
$target_url = rtrim(BACKEND_URL, '/') . '/' . ltrim($path, '/');
if ($query_string) {
    $target_url .= '?' . $query_string;
}

// Stream requests using cURL
$ch = curl_init($target_url);

$headers = [];
$forward_headers = [
    'HTTP_X_CITIBIG_TOKEN' => 'X-Citibig-Token',
    'CONTENT_TYPE' => 'Content-Type',
    'HTTP_ACCEPT' => 'Accept'
];

foreach ($forward_headers as $server_key => $header_name) {
    if (!empty($_SERVER[$server_key])) {
        $headers[] = $header_name . ': ' . $_SERVER[$server_key];
    }
}

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_ENCODING, ""); // Automatically decode compressed responses

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $_POST);
    }
} elseif ($method === 'PUT') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
} elseif ($method === 'DELETE') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
} elseif ($method !== 'GET') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
}

$response = curl_exec($ch);
if (curl_errno($ch)) {
    header('HTTP/1.1 502 Bad Gateway');
    echo json_encode(['error' => 'Proxy Bridge Error: ' . curl_error($ch)]);
    exit;
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$resp_headers = substr($response, 0, $header_size);
$resp_body = substr($response, $header_size);
curl_close($ch);

// Forward backend headers to browser
$header_lines = explode("\r\n", $resp_headers);
foreach ($header_lines as $line) {
    if (empty($line)) continue;
    if (stripos($line, 'Transfer-Encoding:') === 0) continue;
    if (stripos($line, 'Content-Encoding:') === 0) continue; // Strip because curl decoded it
    if (stripos($line, 'Content-Length:') === 0) continue; // Strip because length changed after decode
    if (stripos($line, 'Access-Control-') === 0) continue;
    header($line);
}

// Add local CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Citibig-Token");

if ($method === 'OPTIONS') {
    exit;
}

echo $resp_body;
