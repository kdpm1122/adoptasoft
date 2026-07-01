const { getPool } = require('../../lib/db');
const { handleOptions, jsonResponse, requireMethod } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  if (!requireMethod(req, res, 'POST')) return;

  const authHeader = req.headers['authorization'] || '';
  const match = authHeader.match(/Bearer\s+(\S+)/);
  if (match) {
    const pool = getPool();
    await pool.query('DELETE FROM sesiones WHERE token = $1', [match[1]]);
  }
  jsonResponse(res, { message: 'Sesión cerrada.' });
};
