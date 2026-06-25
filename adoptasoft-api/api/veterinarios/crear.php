<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth.php';

requireMethod('POST');

$pdo = getConnection();
requireRole($pdo, ['admin']);

$body = getJsonBody();
// Coincide con RegisterVetForm.jsx + un campo "email" que se debe agregar
// al formulario (ver README) para que el veterinario pueda iniciar sesión.
requireFields($body, ['name', 'email', 'specialty', 'clinic']);

$stmt = $pdo->prepare('SELECT id_usuario FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $body['email']]);
if ($stmt->fetch()) {
    jsonError('Ya existe un usuario con ese correo.', 409);
}

function parseScheduleLabel(string $label): string
{
    // Convierte "8:00 a.m." -> "08:00:00", "5:00 p.m." -> "17:00:00"
    if (preg_match('/^(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)$/i', trim($label), $m)) {
        $hour = (int) $m[1];
        $isPM = stripos($m[3], 'p') === 0;
        if ($isPM && $hour !== 12) $hour += 12;
        if (!$isPM && $hour === 12) $hour = 0;
        return sprintf('%02d:%s:00', $hour, $m[2]);
    }
    // Si ya viene como "08:00" o "08:00:00", lo dejamos pasar
    if (preg_match('/^\d{2}:\d{2}(:\d{2})?$/', trim($label))) {
        return strlen($label) === 5 ? $label . ':00' : $label;
    }
    return '08:00:00';
}

$pdo->beginTransaction();
try {
    $tempPassword = substr(bin2hex(random_bytes(4)), 0, 8);
    $hashedPassword = password_hash($tempPassword, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare(
        'INSERT INTO usuarios (nombre, email, telefono, password, rol)
         VALUES (:nombre, :email, :telefono, :password, "vet")'
    );
    $stmt->execute([
        'nombre' => $body['name'],
        'email' => $body['email'],
        'telefono' => $body['phone'] ?? null,
        'password' => $hashedPassword,
    ]);
    $idUsuario = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare(
        'INSERT INTO veterinarios_perfil
            (id_usuario, especialidad, clinica, registro_medico, horario_inicio, horario_fin)
         VALUES (:id_usuario, :especialidad, :clinica, :registro_medico, :inicio, :fin)'
    );
    $stmt->execute([
        'id_usuario' => $idUsuario,
        'especialidad' => $body['specialty'],
        'clinica' => $body['clinic'],
        'registro_medico' => $body['medicalLicense'] ?? null,
        'inicio' => parseScheduleLabel($body['scheduleStart'] ?? '8:00 a.m.'),
        'fin' => parseScheduleLabel($body['scheduleEnd'] ?? '5:00 p.m.'),
    ]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    jsonError('No se pudo crear el veterinario: ' . $e->getMessage(), 500);
}

jsonResponse([
    'id' => $idUsuario,
    'name' => $body['name'],
    'specialty' => $body['specialty'],
    'clinic' => $body['clinic'],
    'medicalLicense' => $body['medicalLicense'] ?? null,
    'scheduleStart' => $body['scheduleStart'] ?? '8:00 a.m.',
    'scheduleEnd' => $body['scheduleEnd'] ?? '5:00 p.m.',
    'status' => 'Activo',
    'temporaryPassword' => $tempPassword,
], 201);
