<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('GET');

$pdo = getConnection();
$current = requireAuth($pdo);

if (empty($_GET['mascota'])) {
    jsonError('Falta el parámetro mascota (id de la mascota).', 422);
}
$mascotaId = $_GET['mascota'];

// Si es dueño, confirmamos que la mascota sea suya antes de mostrar el historial.
if ($current['rol'] === 'owner') {
    $stmt = $pdo->prepare('SELECT id_propietario FROM mascotas WHERE id_mascota = :id');
    $stmt->execute(['id' => $mascotaId]);
    $pet = $stmt->fetch();
    if (!$pet || (int) $pet['id_propietario'] !== (int) $current['id_usuario']) {
        jsonError('No tienes acceso al historial de esa mascota.', 403);
    }
}

$stmt = $pdo->prepare(
    'SELECT h.id_historial, h.fecha, h.tipo, h.descripcion, h.medicamento,
            h.peso_actual, h.proxima_cita, h.id_mascota, h.id_veterinario, v.nombre AS veterinario_nombre
     FROM historial_clinico h
     JOIN usuarios v ON v.id_usuario = h.id_veterinario
     WHERE h.id_mascota = :mascota
     ORDER BY h.fecha DESC'
);
$stmt->execute(['mascota' => $mascotaId]);
$historial = $stmt->fetchAll();

$result = array_map(function ($h) {
    return [
        'id' => $h['id_historial'],
        'date' => $h['fecha'],
        'type' => $h['tipo'],
        'description' => $h['descripcion'],
        'treatment' => $h['medicamento'],
        'weight' => $h['peso_actual'] !== null ? (float) $h['peso_actual'] : null,
        'nextDate' => $h['proxima_cita'],
        'petId' => $h['id_mascota'],
        'vetId' => $h['id_veterinario'],
        'vetName' => $h['veterinario_nombre'],
    ];
}, $historial);

jsonResponse(['records' => $result]);
