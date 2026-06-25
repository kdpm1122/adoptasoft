<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('GET');

$pdo = getConnection();
requireRole($pdo, ['admin']);

$stmt = $pdo->query(
    'SELECT id_usuario, nombre, email, documento, telefono, rol, fecha_registro
     FROM usuarios ORDER BY fecha_registro DESC'
);
$usuarios = $stmt->fetchAll();

$result = array_map(function ($u) {
    return [
        'id' => $u['id_usuario'],
        'name' => $u['nombre'],
        'email' => $u['email'],
        'document' => $u['documento'],
        'phone' => $u['telefono'],
        'role' => dbRoleToFrontend($u['rol']),
        'subtitle' => $u['email'] . ($u['documento'] ? ' · ' . $u['documento'] : ''),
        'registeredAt' => $u['fecha_registro'],
    ];
}, $usuarios);

jsonResponse(['users' => $result]);
