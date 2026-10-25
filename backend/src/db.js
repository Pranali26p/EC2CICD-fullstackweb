const mysql = require('mysql2/promise');

// A connection pool is reused across requests. This is the standard
// production pattern - it avoids opening a new TCP connection per request.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ensures the tasks table exists on startup. Handy for a learning project
// so you don't have to run migrations manually the first time.
async function initDb() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
  await pool.query(createTableSql);
  console.log('Database initialised: "tasks" table is ready.');
}

module.exports = { pool, initDb };
