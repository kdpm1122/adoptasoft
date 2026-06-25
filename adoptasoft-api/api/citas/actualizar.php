<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('PUT');

$pdo = getConnection();
$current = requireAuth($pdo); // vet o admin confirman/rechazan; dueño puede cancelar

$id = $_GET['id'] ?? null;
if (!$id) {
    jsonError('Falta el parámetro id.', 422);
}

$body = getJsonBody();
$validStates = ['Pendiente', 'Confirmada', 'Rechazada', 'Cancelada', 'Atendida'];

$fields = [];
$params = ['id' => $id];

if (isset($body['status'])) {
    if (!in_array($body['status'], $validStates, true)) {
        jsonError('Estado inválido.', 422);
    }
    $fields[] = 'estado = :estado';
    $params['estado'] = $body['status'];
}
if (isset($body['date'])) {
    $fields[] = 'fecha = :fecha';
    $params['fecha'] = $body['date'];
}
if (isset($body['time'])) {
    $fields[] = 'hora = :hora';
    $params['hora'] = $body['time'];
}
if (isset($body['vetId'])) {
    $fields[] = 'id_veterinario = :veterinario';
    $params['veterinario'] = $body['vetId'];
}

if (empty($fields)) {
    jsonError('No se enviaron campos para actualizar.', 422);
}

$sql = 'UPDATE citas SET ' . implode(', ', $fields) . ' WHERE id_cita = :id';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

jsonResponse(['message' => 'Cita actualizada.']);
