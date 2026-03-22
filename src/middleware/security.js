const crypto = require('crypto');

/**
 * Validate that incoming requests come from Goldsky via HMAC-SHA256 signature
 */
function validateGoldskySignature(req, res, next) {
  try {
    const signature = req.headers['x-goldsky-signature'];
    const secret = process.env.GOLDSKY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Goldsky signature validation skipped (development mode)');
        return next();
      }
      return res.status(401).json({
        error: 'Unauthorized: Missing Goldsky signature'
      });
    }

    // Verify the signature using HMAC-SHA256
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(req.body));
    const expectedSignature = hmac.digest('hex');

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid Goldsky signature'
      });
    }

    next();
  } catch (error) {
    console.error('Error validating Goldsky signature:', error);
    return res.status(500).json({
      error: 'Internal server error during validation'
    });
  }
}

module.exports = {
  validateGoldskySignature
};
