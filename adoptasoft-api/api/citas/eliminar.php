<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('DELETE');

$pdo = getConnection();
requireAuth($pdo);

$id = $_GET['id'] ?? null;
if (!$id) {
    jsonError('Falta el parámetro id.', 422);
}

$stmt = $pdo->prepare('DELETE FROM citas WHERE id_cita = :id');
$stmt->execute(['id' => $id]);

if ($stmt->rowCount() === 0) {
    jsonError('Cita no encontrada.', 404);
}

jsonResponse(['message' => 'Cita eliminada.']);
