const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

const VALID_STATES = ['Pendiente', 'Confirmada', 'Rechazada', 'Cancelada', 'Atendida'];

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'PUT')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;

  const { id } = req.query;
  if (!id) return jsonError(res, 'Falta el parámetro id.', 422);

  const body = req.body;
  const fields = [];
  const params = [];

  if (body.status !== undefined) {
    if (!VALID_STATES.includes(body.status)) return jsonError(res, 'Estado inválido.', 422);
    params.push(body.status);
    fields.push(`estado = $${params.length}`);
  }
  if (body.date !== undefined) {
    params.push(body.date);
    fields.push(`fecha = $${params.length}`);
  }
  if (body.time !== undefined) {
    params.push(body.time);
    fields.push(`hora = $${params.length}`);
  }
  if (body.vetId !== undefined) {
    params.push(body.vetId);
    fields.push(`id_veterinario = $${params.length}`);
  }
  if (fields.length === 0) return jsonError(res, 'No se enviaron campos para actualizar.', 422);

  params.push(id);
  await pool.query(`UPDATE citas SET ${fields.join(', ')} WHERE id_cita = $${params.length}`, params);

  jsonResponse(res, { message: 'Cita actualizada.' });
};
