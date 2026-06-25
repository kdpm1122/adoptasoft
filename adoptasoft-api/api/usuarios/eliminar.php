<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('DELETE');

$pdo = getConnection();
$current = requireRole($pdo, ['admin']);

$id = $_GET['id'] ?? null;
if (!$id) {
    jsonError('Falta el parámetro id.', 422);
}

if ((int) $id === (int) $current['id_usuario']) {
    jsonError('No puedes eliminar tu propio usuario.', 400);
}

$stmt = $pdo->prepare('DELETE FROM usuarios WHERE id_usuario = :id');
$stmt->execute(['id' => $id]);

if ($stmt->rowCount() === 0) {
    jsonError('Usuario no encontrado.', 404);
}

jsonResponse(['message' => 'Usuario eliminado.']);
