function getAction(req) {
  const path = (req.url || "").split("?")[0];
  const segments = path.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

const handlers = {
  listar: require('../../handlers/mascotas/listar'),
  crear: require('../../handlers/mascotas/crear'),
  actualizar: require('../../handlers/mascotas/actualizar'),
  eliminar: require('../../handlers/mascotas/eliminar'),
};

module.exports = async (req, res) => {
  const action = getAction(req);
  const handler = handlers[action];
  if (!handler) {
    res.status(404).json({ message: `Ruta no encontrada: /mascotas/${action || ''}` });
    return;
  }
  return handler(req, res);
};
