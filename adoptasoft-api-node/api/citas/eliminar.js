const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'DELETE')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;

  const { id } = req.query;
  if (!id) return jsonError(res, 'Falta el parámetro id.', 422);

  const result = await pool.query('DELETE FROM citas WHERE id_cita = $1', [id]);
  if (result.rowCount === 0) return jsonError(res, 'Cita no encontrada.', 404);

  jsonResponse(res, { message: 'Cita eliminada.' });
};
