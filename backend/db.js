const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'taskflow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const verifyDatabaseConnection = async () => {
  const client = await pool.connect();

  try {
    console.log('Connected to PostgreSQL database');
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  verifyDatabaseConnection,
};
