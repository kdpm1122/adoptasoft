<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$body = getJsonBody();
requireFields($body, ['email', 'password']);

$pdo = getConnection();

$stmt = $pdo->prepare('SELECT id_usuario, nombre, email, password, rol FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $body['email']]);
$usuario = $stmt->fetch();

if (!$usuario || !password_verify($body['password'], $usuario['password'])) {
    jsonError('Correo o contraseña incorrectos.', 401);
}

// Si el formulario de login manda un rol seleccionado, lo validamos contra
// el rol real del usuario (en formato frontend: dueño/veterinario/admin).
if (!empty($body['role']) && dbRoleToFrontend($usuario['rol']) !== $body['role']) {
    jsonError('El perfil seleccionado no coincide con este usuario.', 401);
}

$token = createSession($pdo, $usuario['id_usuario']);

jsonResponse([
    'token' => $token,
    'user' => [
        'id' => $usuario['id_usuario'],
        'name' => $usuario['nombre'],
        'email' => $usuario['email'],
        'role' => dbRoleToFrontend($usuario['rol']),
    ],
]);
