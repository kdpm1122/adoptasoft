const bcrypt = require('bcryptjs');
const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod, requireFields } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;
  if (!requireFields(req, res, ['currentPassword', 'newPassword'])) return;

  const { currentPassword, newPassword } = req.body;

  if (newPassword.length < 6) {
    return jsonError(res, 'La nueva contraseña debe tener al menos 6 caracteres.', 422);
  }

  const result = await pool.query(
    'SELECT password FROM usuarios WHERE id_usuario = $1',
    [current.id_usuario]
  );
  const usuario = result.rows[0];
  if (!usuario || !bcrypt.compareSync(currentPassword, usuario.password)) {
    return jsonError(res, 'La contraseña actual es incorrecta.', 401);
  }

  const hash = bcrypt.hashSync(newPassword, 10);
  await pool.query(
    'UPDATE usuarios SET password = $1 WHERE id_usuario = $2',
    [hash, current.id_usuario]
  );

  jsonResponse(res, { message: 'Contraseña actualizada correctamente.' });
};
