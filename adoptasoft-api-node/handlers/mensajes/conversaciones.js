const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, requireMethod } = require('../../lib/response');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'GET')) return;

  const pool = getPool();
  const current = await requireAuth(req, res);
  if (!current) return;

  const result = await pool.query(
    `SELECT
       u.id_usuario AS contacto_id,
       u.nombre AS contacto_nombre,
       u.rol AS contacto_rol,
       lm.mensaje AS ultimo_mensaje,
       lm.fecha_envio AS ultima_fecha,
       (SELECT COUNT(*) FROM mensajes
        WHERE id_receptor = $1 AND id_emisor = u.id_usuario AND leido = FALSE) AS no_leidos
     FROM usuarios u
     JOIN LATERAL (
       SELECT mensaje, fecha_envio
       FROM mensajes
       WHERE (id_emisor = $1 AND id_receptor = u.id_usuario)
          OR (id_emisor = u.id_usuario AND id_receptor = $1)
       ORDER BY fecha_envio DESC
       LIMIT 1
     ) lm ON true
     ORDER BY lm.fecha_envio DESC`,
    [current.id_usuario]
  );

  const conversations = result.rows.map((c) => ({
    contactId: c.contacto_id,
    contactName: c.contacto_nombre,
    contactRole: c.contacto_rol,
    lastMessage: c.ultimo_mensaje,
    lastMessageAt: c.ultima_fecha,
    unread: parseInt(c.no_leidos),
  }));

  jsonResponse(res, { conversations });
};
