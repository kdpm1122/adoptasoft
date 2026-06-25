<?php
/**
 * Helpers genéricos de respuesta, usados por todos los endpoints.
 */

function jsonResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $status = 400): void
{
    jsonResponse(['message' => $message], $status);
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function requireMethod(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        jsonError('Método no permitido. Se esperaba ' . $method . '.', 405);
    }
}

function requireFields(array $data, array $fields): void
{
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            $missing[] = $field;
        }
    }
    if (!empty($missing)) {
        jsonError('Faltan campos obligatorios: ' . implode(', ', $missing) . '.', 422);
    }
}
