const axios = require('axios');
const logger = require('../utils/logger');

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/**
 * Core Nano Banana API call
 */
async function callNanoBanana({ messages, maxTokens = 1024, system }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured. Please set it in your .env file.');
  }

  const payload = {
    model: MODEL,
    max_tokens: maxTokens,
    messages,
  };
  if (system) payload.system = system;

  try {
    const response = await axios.post(ANTHROPIC_API, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      timeout: 55000,
    });

    const content = response.data.content || [];
    const text = content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    logger.debug(`Nano Banana response: ${text.substring(0, 100)}…`);
    return text;
  } catch (err) {
    if (err.response) {
      const msg = err.response.data?.error?.message || `API error ${err.response.status}`;
      logger.error(`Nano Banana API error: ${msg}`);
      throw new Error(msg);
    }
    throw err;
  }
}

/**
 * Build image content block from base64
 */
function imageBlock(base64, mimeType = 'image/jpeg') {
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: mimeType,
      data: base64,
    },
  };
}

// ──────────────────────────────────────────────
//  VIRTUAL TRY-ON
// ──────────────────────────────────────────────
async function virtualTryOn({ personImageBase64, clothImageBase64, clothType, strength, mode, modelStyle }) {
  const content = [];

  if (personImageBase64) {
    content.push(imageBlock(personImageBase64));
    content.push({ type: 'text', text: "This is the person's photo for virtual try-on." });
  }

  if (clothImageBase64) {
    content.push(imageBlock(clothImageBase64));
    content.push({ type: 'text', text: 'This is the clothing item to be tried on.' });
  }

  const modeContext = {
    photo: `Create a detailed virtual try-on analysis. Clothing type: ${clothType || 'upper body'}. Style intensity: ${strength || 7}/10.`,
    mannequin: `Transform this mannequin/flat-lay product to a realistic model wearing it. Model style: ${modelStyle || 'Realistic Photo'}.`,
    snap: `This is a photo of a clothing item taken in a physical store. Analyse how it would look when worn.`,
    url: `Analyse this clothing item from an e-commerce listing for virtual try-on.`,
  };

  content.push({
    type: 'text',
    text: `${modeContext[mode] || modeContext.photo}

Please provide a comprehensive virtual try-on analysis covering:

**Fit & Silhouette**
Describe how the garment drapes and fits the body shape shown.

**Color & Skin Tone**
How well do the colors complement the person's complexion.

**Overall Look**
The complete styled appearance and overall vibe/aesthetic.

**Styling Suggestions**
2-3 specific accessories, shoes, or complementary pieces that would complete this look.

**Confidence Score**
Rate how well this item suits this person out of 10, with a brief reason.

**Similar Items**
Suggest 2 similar items they might also love.

Keep the tone enthusiastic and fashion-forward. Format with clear sections.`,
  });

  const system = `You are Lookr, an expert fashion stylist and virtual try-on AI powered by Nano Banana. 
You analyse clothing items and provide detailed, accurate, and enthusiastic fashion advice. 
Always be positive, specific, and helpful. Use fashion terminology appropriately.`;

  return await callNanoBanana({ messages: [{ role: 'user', content }], maxTokens: 800, system });
}

// ──────────────────────────────────────────────
//  AI STUDIO FEATURES
// ──────────────────────────────────────────────
async function runAestheticTransform({ imageBase64, aesthetic }) {
  const content = [];
  if (imageBase64) {
    content.push(imageBlock(imageBase64));
    content.push({ type: 'text', text: 'This is the outfit photo to be transformed.' });
  }
  content.push({
    type: 'text',
    text: `Transform this outfit into the ${aesthetic} aesthetic. Provide a vivid, detailed styling guide covering:

**The ${aesthetic} Look**
Core visual characteristics of this aesthetic applied to this outfit.

**Color Palette**
Specific colors, tones, and combinations that define this aesthetic for this piece.

**Key Styling Elements**
5-7 specific items: accessories, shoes, bags, jewelry, layering pieces.

**Hair & Makeup**
Complete beauty look that matches this aesthetic.

**Where to Shop**
3-4 specific brands or stores (available in India) that nail this aesthetic.

**The Vibe**
One paragraph painting the complete picture of how this transformed look feels and where it would be worn.

Make it inspiring, specific, and immediately actionable.`,
  });

  return await callNanoBanana({ messages: [{ role: 'user', content }], maxTokens: 700 });
}

async function runPhotoEdit({ imageBase64, editType }) {
  const content = [];
  if (imageBase64) {
    content.push(imageBlock(imageBase64));
  }
  content.push({
    type: 'text',
    text: `You are a professional fashion photographer and retoucher. Provide a detailed ${editType} guide for this photo.

**Current Analysis**
What you see: composition, lighting, background, styling.

**${editType} Transformation Plan**
Step-by-step editing instructions (tools, settings, techniques).

**Specific Adjustments**
Exact values for: exposure, contrast, saturation, colour grading, shadows, highlights.

**Background & Composition**
Cropping suggestions, background treatment.

**Final Result Description**
How the photo will look after the edit — suitable for e-commerce / social media / editorial.

**Tools to Use**
Which apps/software: Lightroom, Snapseed, VSCO, Photoshop — with specific settings.`,
  });

  return await callNanoBanana({ messages: [{ role: 'user', content }], maxTokens: 600 });
}

async function runMannequinToModel({ imageBase64, modelType }) {
  const content = [];
  if (imageBase64) {
    content.push(imageBlock(imageBase64));
    content.push({ type: 'text', text: 'This is the mannequin/flat-lay product image.' });
  }
  content.push({
    type: 'text',
    text: `Transform this mannequin/flat-lay product image into a realistic ${modelType} model shot.

**Garment Analysis**
Describe the clothing item: fabric, cut, silhouette, details, colours.

**Model Direction**
Ideal model type, pose, and expression for this garment.

**Styling on Model**
How the garment would realistically drape, move, and fit on a real person.

**Photography Direction**
Camera angle, lighting setup, background setting that best showcases this piece.

**E-Commerce Optimisation**
How to present this for maximum conversion: lifestyle shot vs. studio shot, model poses.

**Social Media Potential**
Which platform (Instagram/Pinterest) this would perform best on and why.

Describe the final transformed image in vivid detail as if you are looking at the finished shot.`,
  });

  return await callNanoBanana({ messages: [{ role: 'user', content }], maxTokens: 600 });
}

async function runMixAndMatch({ wardrobeItems, occasion, textInput }) {
  const itemList = wardrobeItems || textInput || 'various clothing items';
  const msg = `You are a personal stylist. Create 3 complete outfit combinations from this wardrobe for a ${occasion || 'casual'} occasion.

Wardrobe: ${itemList}

For each outfit:

**Outfit [Number]: [Creative Name]**
- Items used from wardrobe
- How to style/layer them
- Accessories to add
- Shoes recommendation
- Occasion suitability
- Style tip

End with a **Wardrobe Gap Analysis**: 2-3 key pieces missing from this wardrobe that would unlock more outfit possibilities, with budget-friendly suggestions available in India.`;

  return await callNanoBanana({ messages: [{ role: 'user', content: msg }], maxTokens: 800 });
}

async function runSizePredictor({ imageBase64, height }) {
  const content = [];
  if (imageBase64) {
    content.push(imageBlock(imageBase64));
    content.push({ type: 'text', text: `Person's height: ${height || 'unknown'} cm` });
  }
  content.push({
    type: 'text',
    text: `Based on this person's photo and height, provide detailed size recommendations.

**Body Shape Analysis**
Identify the approximate body shape and proportions.

**Size Chart by Brand**
| Brand | Top | Bottom | Dress | Jeans |
Provide size recommendations for: Zara, H&M, Myntra (generic), Amazon (generic), Levi's, Ajio.

**Fit Tips for This Body Type**
5 specific tips for finding well-fitting clothes.

**What to Look For**
Specific cuts, silhouettes, and styles that are most flattering.

**What to Avoid**
Styles that may not work as well, and why.

**Measurement Guide**
How to take accurate measurements at home for online shopping.`,
  });

  return await callNanoBanana({ messages: [{ role: 'user', content }], maxTokens: 700 });
}

async function runStyleAdvisor({ imageBase64, styles, occasion, textInput }) {
  const content = [];
  if (imageBase64) {
    content.push(imageBlock(imageBase64));
  }
  content.push({
    type: 'text',
    text: `You are a world-class personal stylist. Provide comprehensive style advice.

Style preferences: ${styles || 'Classic'}
Occasion: ${occasion || 'Everyday'}
Lifestyle/context: ${textInput || 'Not specified'}

**Your Personal Style Profile**
Based on preferences, define a clear style identity.

**Core Wardrobe Pieces (10 Essentials)**
Specific items that form the foundation of this style, all available in India.

**Colour Palette**
Primary, secondary, and accent colours that work together.

**Outfit Formulas**
3 fail-safe outfit formulas for this style.

**Brands to Explore**
5-6 Indian and international brands available in India that match this aesthetic, with price range.

**Style Upgrade Tips**
3 quick changes that would immediately elevate their look.

**Seasonal Adaptation**
How to adapt this style for Indian summers and winters.`,
  });

  return await callNanoBanana({ messages: [{ role: 'user', content }], maxTokens: 900 });
}

module.exports = {
  virtualTryOn,
  runAestheticTransform,
  runPhotoEdit,
  runMannequinToModel,
  runMixAndMatch,
  runSizePredictor,
  runStyleAdvisor,
};
