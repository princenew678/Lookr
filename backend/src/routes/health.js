const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lookr Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!(process.env.ANTHROPIC_API_KEY &&
      !process.env.ANTHROPIC_API_KEY.includes('REPLACE')),
  });
});

module.exports = router;
