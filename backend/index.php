<?php
declare(strict_types=1);

/**
 * BHOJJ Central API service landing/health endpoint.
 * This file intentionally does not expose environment variables or credentials.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    header('Allow: GET, HEAD, OPTIONS');
    exit;
}

if (!in_array(($_SERVER['REQUEST_METHOD'] ?? 'GET'), ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD, OPTIONS');
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

http_response_code(200);
$response = [
    'success' => true,
    'service' => 'bhojj-central-api',
    'status' => 'running',
    'health' => '/api/health',
    'apiBase' => '/api',
    'note' => 'Service process is responding. Database connectivity must be checked at the API health endpoint or by an authenticated API request.'
];

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
    echo json_encode($response, JSON_UNESCAPED_SLASHES);
}
