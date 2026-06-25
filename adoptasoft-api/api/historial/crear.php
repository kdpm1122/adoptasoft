<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$pdo = getConnection();
$current = requireRole($pdo, ['vet']); // solo un veterinario registra historial

$body = getJsonBody();
// Coincide con RegisterConsultForm.jsx: patientId, type, date, description, weight, treatment, nextDate
requireFields($body, ['patientId', 'type', 'date', 'description']);

$validTypes = ['vacuna', 'diagnostico', 'control'];
if (!in_array($body['type'], $validTypes, true)) {
    jsonError('Tipo de registro inválido.', 422);
}

$stmt = $pdo->prepare(
    'INSERT INTO historial_clinico
        (fecha, tipo, descripcion, medicamento, peso_actual, proxima_cita, id_mascota, id_veterinario)
     VALUES (:fecha, :tipo, :descripcion, :medicamento, :peso, :proxima, :mascota, :veterinario)'
);
$stmt->execute([
    'fecha' => $body['date'],
    'tipo' => $body['type'],
    'descripcion' => $body['description'],
    'medicamento' => $body['treatment'] ?? null,
    'peso' => $body['weight'] !== '' ? ($body['weight'] ?? null) : null,
    'proxima' => $body['nextDate'] !== '' ? ($body['nextDate'] ?? null) : null,
    'mascota' => $body['patientId'],
    'veterinario' => $current['id_usuario'],
]);

$newId = (int) $pdo->lastInsertId();

jsonResponse([
    'id' => $newId,
    'date' => $body['date'],
    'type' => $body['type'],
    'description' => $body['description'],
    'treatment' => $body['treatment'] ?? null,
    'weight' => $body['weight'] ?? null,
    'nextDate' => $body['nextDate'] ?? null,
    'petId' => $body['patientId'],
    'vetId' => $current['id_usuario'],
], 201);
