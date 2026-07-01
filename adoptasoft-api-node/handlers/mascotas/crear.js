const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod, requireFields } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;
  if (!requireFields(req, res, ['name', 'species', 'breed'])) return;

  const body = req.body;
  const ownerId = current.rol === 'owner' ? current.id_usuario : (body.ownerId || null);
  if (!ownerId) return jsonError(res, 'Falta el propietario (ownerId) de la mascota.', 422);

  const result = await pool.query(
    `INSERT INTO mascotas (nombre, especie, raza, edad, peso, sexo, id_propietario)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_mascota`,
    [body.name, body.species, body.breed, body.age || null, body.weight !== '' ? (body.weight || null) : null, body.sex || null, ownerId]
  );

  jsonResponse(res, {
    id: result.rows[0].id_mascota,
    name: body.name,
    species: body.species,
    breed: body.breed,
    age: body.age || null,
    weight: body.weight || null,
    sex: body.sex || null,
    status: 'Activo',
    ownerId,
  }, 201);
};
