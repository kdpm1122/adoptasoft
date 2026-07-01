const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod, requireFields } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;
  if (!requireFields(req, res, ['receptorId', 'mensaje'])) return;

  const { receptorId, mensaje } = req.body;

  if (parseInt(receptorId) === parseInt(current.id_usuario)) {
    return jsonError(res, 'No puedes enviarte un mensaje a ti mismo.', 422);
  }

  const receptorResult = await pool.query('SELECT id_usuario FROM usuarios WHERE id_usuario = $1', [receptorId]);
  if (receptorResult.rows.length === 0) {
    return jsonError(res, 'El destinatario no existe.', 404);
  }

  const result = await pool.query(
    `INSERT INTO mensajes (id_emisor, id_receptor, mensaje)
     VALUES ($1, $2, $3) RETURNING id_mensaje, fecha_envio`,
    [current.id_usuario, receptorId, mensaje]
  );

  jsonResponse(res, {
    id: result.rows[0].id_mensaje,
    senderId: current.id_usuario,
    receiverId: parseInt(receptorId),
    message: mensaje,
    read: false,
    sentAt: result.rows[0].fecha_envio,
  }, 201);
};
