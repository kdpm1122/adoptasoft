const bcrypt = require('bcryptjs');
const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod, requireFields } = require('../../lib/response');
const { requireRole, frontendRoleToDb } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const pool = getPool();
  if (!(await requireRole(req, res, ['admin']))) return;
  if (!requireFields(req, res, ['fullName', 'email', 'role', 'password'])) return;

  const body = req.body;
  const dbRole = frontendRoleToDb(body.role);
  if (!dbRole) return jsonError(res, 'Rol inválido.', 422);

  const existing = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [body.email]);
  if (existing.rows.length > 0) return jsonError(res, 'Ya existe un usuario con ese correo.', 409);
  if (body.password.length < 6) return jsonError(res, 'La contraseña debe tener al menos 6 caracteres.', 422);

  const hash = bcrypt.hashSync(body.password, 10);
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, documento, telefono, password, rol)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario`,
    [body.fullName, body.email, body.document || null, body.phone || null, hash, dbRole]
  );

  jsonResponse(res, {
    id: result.rows[0].id_usuario,
    name: body.fullName,
    email: body.email,
    role: body.role,
    subtitle: body.email,
  }, 201);
};
