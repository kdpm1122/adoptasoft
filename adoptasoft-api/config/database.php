<?php
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'adoptasoft');
define('DB_USER', getenv('DB_USER') ?: 'adoptasoft_user');
define('DB_PASS', getenv('DB_PASS') ?: 'adoptasoft_pass');

function getConnection(): PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'No se pudo conectar a la base de datos: ' . $e->getMessage()]);
        exit;
    }
    return $pdo;
}
