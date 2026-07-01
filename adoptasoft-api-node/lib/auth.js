const crypto = require('crypto');
const { getPool } = require('./db');
const { jsonError } = require('./response');

const TOKEN_LIFETIME_HOURS = 8;

const ROLE_DB_TO_FRONTEND = { owner: 'dueño', vet: 'veterinario', admin: 'admin' };
const ROLE_FRONTEND_TO_DB = { 'dueño': 'owner', veterinario: 'vet', admin: 'admin' };

function dbRoleToFrontend(rol) {
  return ROLE_DB_TO_FRONTEND[rol] || rol;
}

function frontendRoleToDb(rol) {
  return ROLE_FRONTEND_TO_DB[rol] || null;
}

async function createSession(idUsuario) {
  const pool = getPool();
  const token = crypto.randomBytes(32).toString('hex');
  const expira = new Date(Date.now() + TOKEN_LIFETIME_HOURS * 3600 * 1000);
  await pool.query(
    'INSERT INTO sesiones (token, id_usuario, expira_en) VALUES ($1, $2, $3)',
    [token, idUsuario, expira]
  );
  return token;
}

async function requireAuth(req, res) {
  const authHeader = req.headers['authorization'] || '';
  const match = authHeader.match(/Bearer\s+(\S+)/);
  if (!match) {
    jsonError(res, 'No autenticado. Falta el header Authorization: Bearer <token>.', 401);
    return null;
  }
  const pool = getPool();
  const result = await pool.query(
    `SELECT s.id_usuario, u.rol, u.nombre, u.email
     FROM sesiones s JOIN usuarios u ON u.id_usuario = s.id_usuario
     WHERE s.token = $1 AND s.expira_en > NOW()`,
    [match[1]]
  );
  if (result.rows.length === 0) {
    jsonError(res, 'Sesión inválida o expirada. Vuelve a iniciar sesión.', 401);
    return null;
  }
  return result.rows[0];
}

async function requireRole(req, res, allowedDbRoles) {
  const user = await requireAuth(req, res);
  if (!user) return null;
  if (!allowedDbRoles.includes(user.rol)) {
    jsonError(res, 'No tienes permisos para esta acción.', 403);
    return null;
  }
  return user;
}

module.exports = { dbRoleToFrontend, frontendRoleToDb, createSession, requireAuth, requireRole };
