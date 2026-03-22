const express = require('express');
const router = express.Router();
const { processPanicAlert } = require('../controllers/webhookController');
const { validateGoldskySignature } = require('../middleware/security');

// Webhook endpoint for Goldsky events
router.post('/goldsky', validateGoldskySignature, processPanicAlert);

module.exports = router;
