<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('GET');

$pdo = getConnection();
requireAuth($pdo); // cualquier usuario logueado puede ver la lista de veterinarios

function timeToScheduleLabel(string $time): string
{
    // "08:00:00" -> "8:00 a.m." | "17:00:00" -> "5:00 p.m."
    [$h, $m] = explode(':', $time);
    $hour = (int) $h;
    $suffix = $hour >= 12 ? 'p.m.' : 'a.m.';
    $hour12 = $hour % 12;
    if ($hour12 === 0) $hour12 = 12;
    return "{$hour12}:{$m} {$suffix}";
}

$stmt = $pdo->query(
    'SELECT u.id_usuario, u.nombre, vp.especialidad, vp.clinica, vp.registro_medico,
            vp.horario_inicio, vp.horario_fin, vp.estado
     FROM usuarios u
     JOIN veterinarios_perfil vp ON vp.id_usuario = u.id_usuario
     WHERE u.rol = "vet"
     ORDER BY u.nombre'
);
$vets = $stmt->fetchAll();

$result = array_map(function ($v) {
    return [
        'id' => $v['id_usuario'],
        'name' => $v['nombre'],
        'specialty' => $v['especialidad'],
        'clinic' => $v['clinica'],
        'medicalLicense' => $v['registro_medico'],
        'scheduleStart' => timeToScheduleLabel($v['horario_inicio']),
        'scheduleEnd' => timeToScheduleLabel($v['horario_fin']),
        'status' => $v['estado'],
    ];
}, $vets);

jsonResponse(['vets' => $result]);
