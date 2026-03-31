const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/product/fetch
 * Scrape product image and metadata from a shopping URL
 */
router.post('/fetch', [
  body('url').isURL().withMessage('Please provide a valid URL'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { url } = req.body;
  logger.info(`Product fetch request: ${url}`);

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Try common OG / meta tags first (most reliable)
    let imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:secure_url"]').attr('content');

    // Site-specific selectors
    if (!imageUrl) {
      imageUrl =
        // Myntra
        $('img.pdp-e-img').attr('src') ||
        // Amazon
        $('#landingImage').attr('src') ||
        $('#imgBlkFront').attr('src') ||
        // Flipkart
        $('img._396cs4').attr('src') ||
        $('img._2r_T1I').attr('src') ||
        // Ajio
        $('img.rilrtl-lazy-img').attr('src') ||
        // Zara
        $('img.media-image__image').attr('src') ||
        // Generic fallback
        $('img[itemprop="image"]').first().attr('src') ||
        $('img.product-image').first().attr('src');
    }

    const name =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().split('|')[0].trim() ||
      $('h1').first().text().trim() ||
      'Product';

    const brand =
      $('meta[property="og:site_name"]').attr('content') ||
      detectBrand(url);

    const price =
      $('meta[property="product:price:amount"]').attr('content') ||
      $('[itemprop="price"]').attr('content') ||
      $('[class*="price"]').first().text().trim() ||
      '';

    if (!imageUrl) {
      return res.status(422).json({
        error: 'Could not extract product image. Try uploading the image directly.',
        name: name.substring(0, 80),
        brand,
        price,
      });
    }

    // Ensure absolute URL
    if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
    else if (imageUrl.startsWith('/')) {
      const origin = new URL(url).origin;
      imageUrl = origin + imageUrl;
    }

    res.json({
      success: true,
      imageUrl,
      name: name.substring(0, 80),
      brand,
      price: price.substring(0, 20),
    });
  } catch (err) {
    logger.error(`Product fetch error: ${err.message}`);

    if (err.response?.status === 403 || err.response?.status === 429) {
      return res.status(422).json({
        error: 'This website blocks automated access. Please take a screenshot or save the image and upload it directly.',
      });
    }

    res.status(500).json({
      error: 'Could not fetch product. Please upload the clothing image directly.',
    });
  }
});

function detectBrand(url) {
  const map = {
    'amazon': 'Amazon',
    'myntra': 'Myntra',
    'flipkart': 'Flipkart',
    'ajio': 'Ajio',
    'zara': 'Zara',
    'hm.com': 'H&M',
    'nykaa': 'Nykaa Fashion',
    'meesho': 'Meesho',
    'tatacliq': 'Tata CLiQ',
    'reliance': 'Reliance Trends',
    'pantaloons': 'Pantaloons',
    'mango': 'Mango',
    'forever21': 'Forever 21',
    'westside': 'Westside',
    'fab': 'FabIndia',
    'biba': 'Biba',
  };
  for (const [key, val] of Object.entries(map)) {
    if (url.includes(key)) return val;
  }
  try {
    return new URL(url).hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'Unknown Brand';
  }
}

module.exports = router;
