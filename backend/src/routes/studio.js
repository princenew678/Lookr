const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  runAestheticTransform,
  runPhotoEdit,
  runMannequinToModel,
  runMixAndMatch,
  runSizePredictor,
  runStyleAdvisor,
} = require('../services/nanoBanana');
const logger = require('../utils/logger');

const router = express.Router();

const VALID_FEATURES = ['aesthetic', 'photoedit', 'mannequin', 'mix', 'size', 'style'];

const validateStudio = [
  body('feature')
    .isIn(VALID_FEATURES)
    .withMessage(`feature must be one of: ${VALID_FEATURES.join(', ')}`),
];

/**
 * POST /api/studio
 * Run any AI Studio feature
 */
router.post('/', validateStudio, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { feature, imageBase64, params = {} } = req.body;
  logger.info(`Studio request: feature=${feature}`);

  try {
    let result;

    switch (feature) {
      case 'aesthetic':
        result = await runAestheticTransform({
          imageBase64,
          aesthetic: params.option || 'Y2K',
        });
        break;

      case 'photoedit':
        result = await runPhotoEdit({
          imageBase64,
          editType: params.option || 'Auto Enhance',
        });
        break;

      case 'mannequin':
        result = await runMannequinToModel({
          imageBase64,
          modelType: params.option || 'Diverse & Inclusive',
        });
        break;

      case 'mix':
        result = await runMixAndMatch({
          wardrobeItems: params.wardrobeItems,
          occasion: params.option || 'Casual',
          textInput: params.text,
        });
        break;

      case 'size':
        result = await runSizePredictor({
          imageBase64,
          height: params.text,
        });
        break;

      case 'style':
        result = await runStyleAdvisor({
          imageBase64,
          styles: params.option || 'Classic',
          occasion: params.occasion,
          textInput: params.text,
        });
        break;

      default:
        return res.status(400).json({ error: 'Unknown feature' });
    }

    res.json({ success: true, result });
  } catch (err) {
    logger.error(`Studio error [${feature}]: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message || 'AI feature failed. Please try again.',
    });
  }
});

module.exports = router;
