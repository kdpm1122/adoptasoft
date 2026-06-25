<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('PUT');

$pdo = getConnection();
requireRole($pdo, ['admin']);

$id = $_GET['id'] ?? null;
if (!$id) {
    jsonError('Falta el parámetro id.', 422);
}

$body = getJsonBody();
$fields = [];
$params = ['id' => $id];

foreach ([
    'especialidad' => 'specialty',
    'clinica' => 'clinic',
    'registro_medico' => 'medicalLicense',
    'estado' => 'status',
] as $column => $key) {
    if (isset($body[$key])) {
        $fields[] = "$column = :$column";
        $params[$column] = $body[$key];
    }
}

if (empty($fields)) {
    jsonError('No se enviaron campos para actualizar.', 422);
}

$sql = 'UPDATE veterinarios_perfil SET ' . implode(', ', $fields) . ' WHERE id_usuario = :id';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

jsonResponse(['message' => 'Veterinario actualizado.']);
