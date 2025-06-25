const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Optional test function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');
    const res = await client.query('SELECT NOW()');
    console.log('🕐 Server time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
};

module.exports = { pool, testConnection };
