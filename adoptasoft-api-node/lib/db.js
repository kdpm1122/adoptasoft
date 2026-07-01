const { Pool, types } = require('pg');

// Postgres devuelve DATE y TIMESTAMP como objetos Date de JS por defecto.
// Los dejamos como texto plano para que el frontend reciba el mismo
// formato de string que ya esperaba de la API en PHP.
types.setTypeParser(1082, (val) => val); // DATE
types.setTypeParser(1114, (val) => val); // TIMESTAMP sin zona horaria

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

module.exports = { getPool };
