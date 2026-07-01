function getAction(req) {
  const path = (req.url || "").split("?")[0];
  const segments = path.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

const handlers = {
  enviar: require('../../handlers/mensajes/enviar'),
  listar: require('../../handlers/mensajes/listar'),
  conversaciones: require('../../handlers/mensajes/conversaciones'),
};

module.exports = async (req, res) => {
  const action = getAction(req);
  const handler = handlers[action];
  if (!handler) {
    res.status(404).json({ message: `Ruta no encontrada: /mensajes/${action || ''}` });
    return;
  }
  return handler(req, res);
};
