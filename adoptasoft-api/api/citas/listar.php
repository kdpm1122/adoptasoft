<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('GET');

$pdo = getConnection();
$current = requireAuth($pdo);

$sql = 'SELECT c.id_cita, c.fecha, c.hora, c.tipo, c.motivo, c.estado,
               c.id_mascota, m.nombre AS mascota_nombre, m.id_propietario,
               c.id_veterinario, v.nombre AS veterinario_nombre
        FROM citas c
        JOIN mascotas m ON m.id_mascota = c.id_mascota
        LEFT JOIN usuarios v ON v.id_usuario = c.id_veterinario';
$where = [];
$params = [];

if ($current['rol'] === 'owner') {
    $where[] = 'm.id_propietario = :propietario';
    $params['propietario'] = $current['id_usuario'];
} elseif ($current['rol'] === 'vet') {
    $where[] = 'c.id_veterinario = :veterinario';
    $params['veterinario'] = $current['id_usuario'];
} elseif (!empty($_GET['mascota'])) {
    $where[] = 'c.id_mascota = :mascota';
    $params['mascota'] = $_GET['mascota'];
}

if (!empty($where)) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}
$sql .= ' ORDER BY c.fecha, c.hora';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$citas = $stmt->fetchAll();

$result = array_map(function ($c) {
    return [
        'id' => $c['id_cita'],
        'date' => $c['fecha'],
        'time' => substr($c['hora'], 0, 5),
        'type' => $c['tipo'],
        'reason' => $c['motivo'],
        'status' => $c['estado'],
        'petId' => $c['id_mascota'],
        'petName' => $c['mascota_nombre'],
        'ownerId' => $c['id_propietario'],
        'vetId' => $c['id_veterinario'],
        'vetName' => $c['veterinario_nombre'],
    ];
}, $citas);

jsonResponse(['appointments' => $result]);
