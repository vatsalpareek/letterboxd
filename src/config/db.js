const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Database connection error', err.stack));

module.exports = {
    query: (text, params) => pool.query(text, params),
};