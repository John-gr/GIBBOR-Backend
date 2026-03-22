// In production: integrate with Twilio, AWS SNS, or similar SMS provider
const logger = require('../utils/logger');

/**
 * Send emergency SMS to preconfigured contacts.
 * Currently a mock — replace the body with a real Twilio/SNS call for production.
 *
 * Required env vars for Twilio:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 *   TWILIO_PHONE_NUMBER, EMERGENCY_CONTACT_NUMBERS (comma-separated)
 */
async function sendEmergencySMS({ user_id, location, evidence_hash, timestamp }) {
  try {
    const alertMessage =
      `EMERGENCY ALERT: User ${user_id} triggered a panic alert at ${location}. ` +
      `Evidence hash: ${evidence_hash}. Time: ${new Date(timestamp).toISOString()}`;

    // --- Twilio example (uncomment and install twilio package for production) ---
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // const contacts = (process.env.EMERGENCY_CONTACT_NUMBERS || '').split(',').filter(Boolean);
    // await Promise.all(contacts.map(to =>
    //   client.messages.create({ body: alertMessage, from: process.env.TWILIO_PHONE_NUMBER, to })
    // ));
    // ---------------------------------------------------------------------------

    logger.info(`SMS sent: ${alertMessage}`);

    return {
      success: true,
      messageId: 'mock-sms-id-' + Date.now(),
      message: alertMessage
    };
  } catch (error) {
    logger.error(`Failed to send emergency SMS: ${error.message}`);
    throw error;
  }
}

module.exports = {
  sendEmergencySMS
};
