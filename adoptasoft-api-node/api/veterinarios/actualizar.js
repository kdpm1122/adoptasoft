const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod } = require('../../lib/response');
const { requireRole } = require('../../lib/auth');

const MAP = { especialidad: 'specialty', clinica: 'clinic', registro_medico: 'medicalLicense', estado: 'status' };

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'PUT')) return;

  const pool = getPool();
  const current = await requireRole(req, res, ['admin']);
  if (!current) return;

  const { id } = req.query;
  if (!id) return jsonError(res, 'Falta el parámetro id.', 422);

  const body = req.body;
  const fields = [];
  const params = [];
  for (const [column, key] of Object.entries(MAP)) {
    if (body[key] !== undefined) {
      params.push(body[key]);
      fields.push(`${column} = $${params.length}`);
    }
  }
  if (fields.length === 0) return jsonError(res, 'No se enviaron campos para actualizar.', 422);

  params.push(id);
  await pool.query(`UPDATE veterinarios_perfil SET ${fields.join(', ')} WHERE id_usuario = $${params.length}`, params);

  jsonResponse(res, { message: 'Veterinario actualizado.' });
};
