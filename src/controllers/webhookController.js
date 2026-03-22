const { sendEmergencySMS } = require('../services/smsService');
const { storeEvidence } = require('../services/evidenceService');
const logger = require('../utils/logger');

/**
 * Process incoming PanicAlert events from Goldsky
 */
async function processPanicAlert(req, res) {
  try {
    const { evidence_hash, location, user_id, timestamp, transaction_hash } = req.body;

    logger.info(`Received PanicAlert for user ${user_id} with evidence hash ${evidence_hash}`);

    // Validate required fields
    if (!evidence_hash || !location || !user_id) {
      return res.status(400).json({
        error: 'Missing required fields: evidence_hash, location, user_id'
      });
    }

    // Store the evidence linked to the blockchain hash
    await storeEvidence({
      evidence_hash,
      location,
      user_id,
      timestamp,
      transaction_hash,
      received_at: new Date().toISOString()
    });

    // Send emergency SMS to preconfigured contacts
    await sendEmergencySMS({
      user_id,
      location,
      evidence_hash,
      timestamp
    });

    logger.info(`Emergency response initiated for user ${user_id}`);

    res.status(200).json({
      status: 'success',
      message: 'Panic alert processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error processing PanicAlert: ${error.message}`);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  processPanicAlert
};
