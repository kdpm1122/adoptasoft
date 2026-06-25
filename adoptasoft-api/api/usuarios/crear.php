<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$pdo = getConnection();
requireRole($pdo, ['admin']);

$body = getJsonBody();
// Coincide con CreateUserForm.jsx: fullName, email, role, phone, document
requireFields($body, ['fullName', 'email', 'role']);

$dbRole = frontendRoleToDb($body['role']);
if ($dbRole === null) {
    jsonError('Rol inválido.', 422);
}

$stmt = $pdo->prepare('SELECT id_usuario FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $body['email']]);
if ($stmt->fetch()) {
    jsonError('Ya existe un usuario con ese correo.', 409);
}

// CreateUserForm.jsx no pide contraseña todavía: generamos una temporal.
// En un flujo real se enviaría por correo o se forzaría un cambio en el
// primer login. Aquí la devolvemos una sola vez en la respuesta.
$tempPassword = substr(bin2hex(random_bytes(4)), 0, 8);
$hashedPassword = password_hash($tempPassword, PASSWORD_BCRYPT);

$stmt = $pdo->prepare(
    'INSERT INTO usuarios (nombre, email, documento, telefono, password, rol)
     VALUES (:nombre, :email, :documento, :telefono, :password, :rol)'
);
$stmt->execute([
    'nombre' => $body['fullName'],
    'email' => $body['email'],
    'documento' => $body['document'] ?? null,
    'telefono' => $body['phone'] ?? null,
    'password' => $hashedPassword,
    'rol' => $dbRole,
]);

$newId = (int) $pdo->lastInsertId();

jsonResponse([
    'id' => $newId,
    'name' => $body['fullName'],
    'email' => $body['email'],
    'role' => $body['role'],
    'subtitle' => $body['email'] . ($body['document'] ?? '' ? ' · ' . $body['document'] : ''),
    'temporaryPassword' => $tempPassword,
], 201);
