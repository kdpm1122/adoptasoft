const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod, requireFields } = require('../../lib/response');
const { requireRole } = require('../../lib/auth');

const VALID_TYPES = ['vacuna', 'diagnostico', 'control'];

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const pool = getPool();
  const current = await requireRole(req, res, ['vet']);
  if (!current) return;
  if (!requireFields(req, res, ['patientId', 'type', 'date', 'description'])) return;

  const body = req.body;
  if (!VALID_TYPES.includes(body.type)) return jsonError(res, 'Tipo de registro inválido.', 422);

  const result = await pool.query(
    `INSERT INTO historial_clinico (fecha, tipo, descripcion, medicamento, peso_actual, proxima_cita, id_mascota, id_veterinario)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_historial`,
    [body.date, body.type, body.description, body.treatment || null,
     body.weight !== '' ? (body.weight || null) : null, body.nextDate !== '' ? (body.nextDate || null) : null,
     body.patientId, current.id_usuario]
  );

  jsonResponse(res, {
    id: result.rows[0].id_historial,
    date: body.date,
    type: body.type,
    description: body.description,
    treatment: body.treatment || null,
    weight: body.weight || null,
    nextDate: body.nextDate || null,
    petId: body.patientId,
    vetId: current.id_usuario,
  }, 201);
};
