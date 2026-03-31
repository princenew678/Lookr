const express = require('express');
const { body, validationResult } = require('express-validator');
const { virtualTryOn } = require('../services/nanoBanana');
const logger = require('../utils/logger');

const router = express.Router();

// Input validation middleware
const validateTryOn = [
  body('mode')
    .isIn(['photo', 'url', 'mannequin', 'snap'])
    .withMessage('mode must be one of: photo, url, mannequin, snap'),
  body('clothType')
    .optional()
    .isIn(['upper', 'lower', 'full', 'accessory'])
    .withMessage('Invalid cloth type'),
  body('strength')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('strength must be 1–10'),
];

/**
 * POST /api/tryon
 * Main virtual try-on endpoint
 */
router.post('/', validateTryOn, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  const {
    personImageBase64,
    clothImageBase64,
    productUrl,
    clothType = 'upper',
    strength = 7,
    mode = 'photo',
    modelStyle = 'Realistic Photo',
  } = req.body;

  // Must have at least a cloth image or product URL
  if (!clothImageBase64 && !productUrl) {
    return res.status(400).json({
      success: false,
      error: 'Please provide either a clothing image or a product URL.',
    });
  }

  logger.info(`Try-on request: mode=${mode}, clothType=${clothType}`);

  try {
    const analysis = await virtualTryOn({
      personImageBase64,
      clothImageBase64,
      clothType,
      strength,
      mode,
      modelStyle,
    });

    // Extract confidence score from response (simple heuristic)
    const scoreMatch = analysis.match(/(\d+)\s*\/\s*10/);
    const confidenceScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

    res.json({
      success: true,
      analysis,
      confidenceScore,
      mode,
    });
  } catch (err) {
    logger.error(`Try-on error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message || 'Virtual try-on failed. Please try again.',
    });
  }
});

module.exports = router;
