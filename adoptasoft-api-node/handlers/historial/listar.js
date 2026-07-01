const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'GET')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;

  const mascotaId = req.query.mascota;
  if (!mascotaId) return jsonError(res, 'Falta el parámetro mascota (id de la mascota).', 422);

  if (current.rol === 'owner') {
    const petResult = await pool.query('SELECT id_propietario FROM mascotas WHERE id_mascota = $1', [mascotaId]);
    const pet = petResult.rows[0];
    if (!pet || parseInt(pet.id_propietario) !== parseInt(current.id_usuario)) {
      return jsonError(res, 'No tienes acceso al historial de esa mascota.', 403);
    }
  }

  const result = await pool.query(
    `SELECT h.id_historial, h.fecha, h.tipo, h.descripcion, h.medicamento,
            h.peso_actual, h.proxima_cita, h.id_mascota, h.id_veterinario, v.nombre AS veterinario_nombre
     FROM historial_clinico h
     JOIN usuarios v ON v.id_usuario = h.id_veterinario
     WHERE h.id_mascota = $1
     ORDER BY h.fecha DESC`,
    [mascotaId]
  );

  const records = result.rows.map((h) => ({
    id: h.id_historial,
    date: h.fecha,
    type: h.tipo,
    description: h.descripcion,
    treatment: h.medicamento,
    weight: h.peso_actual !== null ? parseFloat(h.peso_actual) : null,
    nextDate: h.proxima_cita,
    petId: h.id_mascota,
    vetId: h.id_veterinario,
    vetName: h.veterinario_nombre,
  }));

  jsonResponse(res, { records });
};
