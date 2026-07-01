function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function handleOptions(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

function jsonResponse(res, data, status = 200) {
  res.status(status).json(data);
}

function jsonError(res, message, status = 400) {
  jsonResponse(res, { message }, status);
}

function requireMethod(req, res, method) {
  if (req.method !== method) {
    jsonError(res, `Método no permitido. Se esperaba ${method}.`, 405);
    return false;
  }
  return true;
}

function requireFields(req, res, fields) {
  const body = req.body || {};
  const missing = fields.filter((f) => body[f] === undefined || body[f] === '');
  if (missing.length > 0) {
    jsonError(res, `Faltan campos obligatorios: ${missing.join(', ')}.`, 422);
    return false;
  }
  return true;
}

module.exports = { setCors, handleOptions, jsonResponse, jsonError, requireMethod, requireFields };
