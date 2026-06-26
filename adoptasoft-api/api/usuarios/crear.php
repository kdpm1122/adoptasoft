<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');
$pdo = getConnection();
requireRole($pdo, ['admin']);
$body = getJsonBody();
requireFields($body, ['fullName', 'email', 'role', 'password']);
$dbRole = frontendRoleToDb($body['role']);
if ($dbRole === null) jsonError('Rol inválido.', 422);
$stmt = $pdo->prepare('SELECT id_usuario FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $body['email']]);
if ($stmt->fetch()) jsonError('Ya existe un usuario con ese correo.', 409);
if (strlen($body['password']) < 6) jsonError('La contraseña debe tener al menos 6 caracteres.', 422);
$hash = password_hash($body['password'], PASSWORD_BCRYPT);
$stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, documento, telefono, password, rol) VALUES (:nombre, :email, :documento, :telefono, :password, :rol)');
$stmt->execute(['nombre' => $body['fullName'], 'email' => $body['email'], 'documento' => $body['document'] ?? null, 'telefono' => $body['phone'] ?? null, 'password' => $hash, 'rol' => $dbRole]);
$newId = (int) $pdo->lastInsertId();
jsonResponse(['id' => $newId, 'name' => $body['fullName'], 'email' => $body['email'], 'role' => $body['role'], 'subtitle' => $body['email']], 201);
