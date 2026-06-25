<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$pdo = getConnection();
$current = requireAuth($pdo); // dueño, vet o admin pueden registrar una mascota

$body = getJsonBody();
// Coincide con PetRegisterForm.jsx: name, species, breed, age, weight, sex
requireFields($body, ['name', 'species', 'breed']);

// Si quien crea es un dueño, la mascota queda asociada a él automáticamente.
// Si es vet/admin, puede mandar ownerId explícito.
$ownerId = $current['rol'] === 'owner' ? $current['id_usuario'] : ($body['ownerId'] ?? null);
if (!$ownerId) {
    jsonError('Falta el propietario (ownerId) de la mascota.', 422);
}

$stmt = $pdo->prepare(
    'INSERT INTO mascotas (nombre, especie, raza, edad, peso, sexo, id_propietario)
     VALUES (:nombre, :especie, :raza, :edad, :peso, :sexo, :propietario)'
);
$stmt->execute([
    'nombre' => $body['name'],
    'especie' => $body['species'],
    'raza' => $body['breed'],
    'edad' => $body['age'] ?? null,
    'peso' => $body['weight'] !== '' ? ($body['weight'] ?? null) : null,
    'sexo' => $body['sex'] ?? null,
    'propietario' => $ownerId,
]);

$newId = (int) $pdo->lastInsertId();

jsonResponse([
    'id' => $newId,
    'name' => $body['name'],
    'species' => $body['species'],
    'breed' => $body['breed'],
    'age' => $body['age'] ?? null,
    'weight' => $body['weight'] ?? null,
    'sex' => $body['sex'] ?? null,
    'status' => 'Activo',
    'ownerId' => $ownerId,
], 201);
