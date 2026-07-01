const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod } = require('../../lib/response');
const { requireRole } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'DELETE')) return;

  const pool = getPool();
  const current = await requireRole(req, res, ['admin']);
  if (!current) return;

  const { id } = req.query;
  if (!id) return jsonError(res, 'Falta el parámetro id.', 422);
  if (parseInt(id) === parseInt(current.id_usuario)) {
    return jsonError(res, 'No puedes eliminar tu propio usuario.', 400);
  }

  const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
  if (result.rowCount === 0) return jsonError(res, 'Usuario no encontrado.', 404);

  jsonResponse(res, { message: 'Usuario eliminado.' });
};
