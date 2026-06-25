<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$pdo = getConnection();
$current = requireAuth($pdo);

$body = getJsonBody();
// Coincide con AppointmentForm.jsx: petId, vetId, type, date, time, reason
requireFields($body, ['petId', 'date', 'time']);

// Si es dueño, verificamos que la mascota sea suya antes de agendar.
if ($current['rol'] === 'owner') {
    $stmt = $pdo->prepare('SELECT id_propietario FROM mascotas WHERE id_mascota = :id');
    $stmt->execute(['id' => $body['petId']]);
    $pet = $stmt->fetch();
    if (!$pet || (int) $pet['id_propietario'] !== (int) $current['id_usuario']) {
        jsonError('Esa mascota no te pertenece.', 403);
    }
}

$stmt = $pdo->prepare(
    'INSERT INTO citas (fecha, hora, tipo, motivo, id_mascota, id_veterinario)
     VALUES (:fecha, :hora, :tipo, :motivo, :mascota, :veterinario)'
);
$stmt->execute([
    'fecha' => $body['date'],
    'hora' => $body['time'],
    'tipo' => $body['type'] ?? null,
    'motivo' => $body['reason'] ?? null,
    'mascota' => $body['petId'],
    'veterinario' => $body['vetId'] ?? null,
]);

$newId = (int) $pdo->lastInsertId();

jsonResponse([
    'id' => $newId,
    'date' => $body['date'],
    'time' => $body['time'],
    'type' => $body['type'] ?? null,
    'reason' => $body['reason'] ?? null,
    'status' => 'Pendiente',
    'petId' => $body['petId'],
    'vetId' => $body['vetId'] ?? null,
], 201);
