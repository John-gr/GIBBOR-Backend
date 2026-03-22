// In production: integrate with PostgreSQL/MongoDB + AWS S3/IPFS for media storage
const logger = require('../utils/logger');

/**
 * Store evidence metadata linked to the blockchain hash.
 * In production this would persist to a database and link to secure media storage.
 */
async function storeEvidence({ evidence_hash, location, user_id, timestamp, transaction_hash, received_at }) {
  try {
    const evidenceRecord = {
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      evidence_hash,
      location,
      user_id,
      timestamp: parseInt(timestamp),
      transaction_hash,
      received_at,
      stored_at: new Date().toISOString(),
      status: 'secured'
    };

    logger.info(`Evidence stored: ${JSON.stringify(evidenceRecord)}`);

    return {
      success: true,
      evidenceId: evidenceRecord.id,
      record: evidenceRecord
    };
  } catch (error) {
    logger.error(`Failed to store evidence: ${error.message}`);
    throw error;
  }
}

module.exports = {
  storeEvidence
};
