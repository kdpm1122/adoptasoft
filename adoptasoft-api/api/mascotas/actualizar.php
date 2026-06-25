<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('PUT');

$pdo = getConnection();
requireAuth($pdo);

$id = $_GET['id'] ?? null;
if (!$id) {
    jsonError('Falta el parámetro id.', 422);
}

$body = getJsonBody();
$map = [
    'nombre' => 'name', 'especie' => 'species', 'raza' => 'breed',
    'edad' => 'age', 'peso' => 'weight', 'sexo' => 'sex', 'estado' => 'status',
];

$fields = [];
$params = ['id' => $id];
foreach ($map as $column => $key) {
    if (isset($body[$key])) {
        $fields[] = "$column = :$column";
        $params[$column] = $body[$key];
    }
}

if (empty($fields)) {
    jsonError('No se enviaron campos para actualizar.', 422);
}

$sql = 'UPDATE mascotas SET ' . implode(', ', $fields) . ' WHERE id_mascota = :id';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

jsonResponse(['message' => 'Mascota actualizada.']);
