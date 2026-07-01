const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod, requireFields } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;
  if (!requireFields(req, res, ['petId', 'date', 'time'])) return;

  const body = req.body;

  if (current.rol === 'owner') {
    const petResult = await pool.query('SELECT id_propietario FROM mascotas WHERE id_mascota = $1', [body.petId]);
    const pet = petResult.rows[0];
    if (!pet || parseInt(pet.id_propietario) !== parseInt(current.id_usuario)) {
      return jsonError(res, 'Esa mascota no te pertenece.', 403);
    }
  }

  const result = await pool.query(
    `INSERT INTO citas (fecha, hora, tipo, motivo, id_mascota, id_veterinario)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_cita`,
    [body.date, body.time, body.type || null, body.reason || null, body.petId, body.vetId || null]
  );

  jsonResponse(res, {
    id: result.rows[0].id_cita,
    date: body.date,
    time: body.time,
    type: body.type || null,
    reason: body.reason || null,
    status: 'Pendiente',
    petId: body.petId,
    vetId: body.vetId || null,
  }, 201);
};
