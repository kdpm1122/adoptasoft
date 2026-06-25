<?php
/**
 * Autenticación simple basada en token (no es JWT, es un token aleatorio
 * guardado en la tabla `sesiones`). Suficiente para un proyecto académico:
 * el frontend lo manda como header "Authorization: Bearer <token>".
 */

require_once __DIR__ . '/response.php';

const TOKEN_LIFETIME_HOURS = 8;

// La BD guarda los roles en inglés (owner/vet/admin), pero el frontend
// (src/domain/entities/User.js -> ROLES) los espera en español.
const ROLE_DB_TO_FRONTEND = [
    'owner' => 'dueño',
    'vet'   => 'veterinario',
    'admin' => 'admin',
];

const ROLE_FRONTEND_TO_DB = [
    'dueño'       => 'owner',
    'veterinario' => 'vet',
    'admin'       => 'admin',
];

function dbRoleToFrontend(string $rol): string
{
    return ROLE_DB_TO_FRONTEND[$rol] ?? $rol;
}

function frontendRoleToDb(string $rol): ?string
{
    return ROLE_FRONTEND_TO_DB[$rol] ?? null;
}

function createSession(PDO $pdo, int $idUsuario): string
{
    $token = bin2hex(random_bytes(32));
    $expira = (new DateTime())->modify('+' . TOKEN_LIFETIME_HOURS . ' hours')->format('Y-m-d H:i:s');

    $stmt = $pdo->prepare(
        'INSERT INTO sesiones (token, id_usuario, expira_en) VALUES (:token, :id_usuario, :expira_en)'
    );
    $stmt->execute(['token' => $token, 'id_usuario' => $idUsuario, 'expira_en' => $expira]);

    return $token;
}

/**
 * Lee el header Authorization, valida el token contra la tabla `sesiones`
 * y devuelve el usuario autenticado (id_usuario, rol). Si no es válido,
 * corta la ejecución con un 401.
 */
function requireAuth(PDO $pdo): array
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');

    if (!preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        jsonError('No autenticado. Falta el header Authorization: Bearer <token>.', 401);
    }

    $token = $matches[1];

    $stmt = $pdo->prepare(
        'SELECT s.id_usuario, u.rol, u.nombre, u.email
         FROM sesiones s
         JOIN usuarios u ON u.id_usuario = s.id_usuario
         WHERE s.token = :token AND s.expira_en > NOW()'
    );
    $stmt->execute(['token' => $token]);
    $session = $stmt->fetch();

    if (!$session) {
        jsonError('Sesión inválida o expirada. Vuelve a iniciar sesión.', 401);
    }

    return $session;
}

/**
 * Igual que requireAuth, pero además exige que el rol (en formato DB:
 * owner/vet/admin) esté dentro de los roles permitidos.
 */
function requireRole(PDO $pdo, array $allowedDbRoles): array
{
    $user = requireAuth($pdo);
    if (!in_array($user['rol'], $allowedDbRoles, true)) {
        jsonError('No tienes permisos para esta acción.', 403);
    }
    return $user;
}
