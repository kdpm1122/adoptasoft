<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('GET');

$pdo = getConnection();
$current = requireAuth($pdo);

// Un dueño solo ve sus propias mascotas. Vets/admin pueden ver todas,
// o filtrar con ?propietario=ID si lo necesitan.
$sql = 'SELECT m.id_mascota, m.nombre, m.especie, m.raza, m.edad, m.peso, m.sexo, m.estado,
               m.id_propietario, u.nombre AS propietario_nombre
        FROM mascotas m
        JOIN usuarios u ON u.id_usuario = m.id_propietario';
$params = [];

if ($current['rol'] === 'owner') {
    $sql .= ' WHERE m.id_propietario = :propietario';
    $params['propietario'] = $current['id_usuario'];
} elseif (!empty($_GET['propietario'])) {
    $sql .= ' WHERE m.id_propietario = :propietario';
    $params['propietario'] = $_GET['propietario'];
}

$sql .= ' ORDER BY m.nombre';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$mascotas = $stmt->fetchAll();

$result = array_map(function ($m) {
    return [
        'id' => $m['id_mascota'],
        'name' => $m['nombre'],
        'species' => $m['especie'],
        'breed' => $m['raza'],
        'age' => $m['edad'],
        'weight' => $m['peso'] !== null ? (float) $m['peso'] : null,
        'sex' => $m['sexo'],
        'status' => $m['estado'],
        'ownerId' => $m['id_propietario'],
        'ownerName' => $m['propietario_nombre'],
    ];
}, $mascotas);

jsonResponse(['pets' => $result]);
