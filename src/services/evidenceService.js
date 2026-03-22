const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Connection pool — reuses connections instead of opening one per request
let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.MYSQL_HOST     || 'localhost',
      port:     parseInt(process.env.MYSQL_PORT || '3306'),
      user:     process.env.MYSQL_USER     || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'gibbor',
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

/**
 * Ensure the evidence table exists (runs once on first call)
 */
async function ensureTable() {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS panic_alert_events (
      id              VARCHAR(64)  PRIMARY KEY,
      evidence_hash   VARCHAR(255) NOT NULL,
      location        TEXT         NOT NULL,
      user_id         VARCHAR(255) NOT NULL,
      timestamp       BIGINT,
      transaction_hash VARCHAR(255),
      received_at     DATETIME     NOT NULL,
      stored_at       DATETIME     NOT NULL,
      status          VARCHAR(50)  NOT NULL DEFAULT 'secured'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

/**
 * Store evidence metadata linked to the blockchain hash in MySQL.
 */
async function storeEvidence({ evidence_hash, location, user_id, timestamp, transaction_hash, received_at }) {
  try {
    await ensureTable();

    const id = `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stored_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const received = new Date(received_at).toISOString().slice(0, 19).replace('T', ' ');

    const db = getPool();
    await db.execute(
      `INSERT INTO panic_alert_events
        (id, evidence_hash, location, user_id, timestamp, transaction_hash, received_at, stored_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'secured')`,
      [id, evidence_hash, location, user_id, parseInt(timestamp) || null, transaction_hash || null, received, stored_at]
    );

    logger.info(`Evidence stored in MySQL: id=${id} user=${user_id} hash=${evidence_hash}`);

    return { success: true, evidenceId: id };
  } catch (error) {
    logger.error(`Failed to store evidence: ${error.message}`);
    throw error;
  }
}

module.exports = { storeEvidence };
