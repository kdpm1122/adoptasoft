<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$pdo = getConnection();
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');

if (preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
    $stmt = $pdo->prepare('DELETE FROM sesiones WHERE token = :token');
    $stmt->execute(['token' => $matches[1]]);
}

jsonResponse(['message' => 'Sesión cerrada.']);
