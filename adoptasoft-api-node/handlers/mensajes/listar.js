const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, jsonError, requireMethod } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'GET')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;

  const otroId = req.query.con;
  if (!otroId) return jsonError(res, 'Falta el parámetro con (id del otro usuario).', 422);

  const result = await pool.query(
    `SELECT id_mensaje, id_emisor, id_receptor, mensaje, leido, fecha_envio
     FROM mensajes
     WHERE (id_emisor = $1 AND id_receptor = $2) OR (id_emisor = $2 AND id_receptor = $1)
     ORDER BY fecha_envio ASC`,
    [current.id_usuario, otroId]
  );

  await pool.query(
    `UPDATE mensajes SET leido = TRUE WHERE id_receptor = $1 AND id_emisor = $2 AND leido = FALSE`,
    [current.id_usuario, otroId]
  );

  const messages = result.rows.map((m) => ({
    id: m.id_mensaje,
    senderId: m.id_emisor,
    receiverId: m.id_receptor,
    message: m.mensaje,
    read: m.leido,
    sentAt: m.fecha_envio,
    mine: m.id_emisor === current.id_usuario,
  }));

  jsonResponse(res, { messages });
};
