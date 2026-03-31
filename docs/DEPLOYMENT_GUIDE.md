# Lookr – Complete Deployment Guide
## From Zero to Google Play Store & Apple App Store

---

## TABLE OF CONTENTS
1. Prerequisites
2. Get Your Nano Banana (Anthropic) API Key
3. Set Up the Backend Server
4. Deploy Backend to Railway (Free)
5. Set Up the React Native App
6. Build for Android (Google Play)
7. Build for iOS (App Store)
8. Submit to Google Play Store
9. Submit to Apple App Store
10. Post-Launch Checklist

---

## 1. PREREQUISITES

Install these on your computer before starting:

### Required Software

| Tool | Download | Why |
|------|----------|-----|
| Node.js 18+ | https://nodejs.org | Backend + React Native |
| Android Studio | https://developer.android.com/studio | Android build |
| Xcode 14+ (Mac only) | App Store (Mac) | iOS build |
| Git | https://git-scm.com | Version control |
| VS Code | https://code.visualstudio.com | Code editor |

### Verify Installation
```bash
node --version      # Should show v18.x.x or higher
npm --version       # Should show 9.x.x or higher
git --version       # Should show 2.x.x or higher
```

### Java (for Android)
Android Studio includes Java, but verify:
```bash
java --version      # Should show 17 or higher
```

---

## 2. GET YOUR NANO BANANA (ANTHROPIC) API KEY

This is the AI brain of Lookr. Follow these steps:

### Step 1: Create an Anthropic Account
1. Go to **https://console.anthropic.com/**
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### Step 2: Add a Payment Method
1. Go to **https://console.anthropic.com/settings/billing**
2. Click **"Add payment method"**
3. Add your credit/debit card
   - You get **$5 free credits** as a new user
   - Virtual try-ons cost approximately **$0.003–0.015 each** (fractions of a cent)
   - 1000 try-ons ≈ $3–15

### Step 3: Generate Your API Key
1. Go to **https://console.anthropic.com/settings/keys**
2. Click **"Create Key"**
3. Name it: `Lookr Production`
4. Copy the key — it starts with `sk-ant-api03-…`
5. **Save it securely** — you can only see it once!

### Estimated Costs
```
Free credits:        $5 (new accounts)
Per try-on call:     ~$0.005–0.02
1,000 try-ons:       ~$5–20
Monthly (active app): ~$20–100 depending on users
```

---

## 3. SET UP THE BACKEND SERVER

### Step 1: Open the backend folder
```bash
cd lookr/backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create your .env file
```bash
cp .env.example .env
```

### Step 4: Add your API key to .env
Open `.env` in VS Code and replace the placeholder:
```
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=*
```

### Step 5: Test locally
```bash
npm run dev
```

You should see:
```
🚀 Lookr backend running on port 3000
✅ Anthropic API key detected
```

### Step 6: Test the API
Open a new terminal:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Lookr Backend",
  "apiKeyConfigured": true
}
```

---

## 4. DEPLOY BACKEND TO RAILWAY (FREE TIER)

Railway gives you a free public URL for your backend. Free tier includes 500 hours/month.

### Step 1: Create a Railway account
1. Go to **https://railway.app**
2. Sign up with GitHub (recommended)

### Step 2: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 3: Deploy the backend
```bash
cd lookr/backend

# Initialize Railway project
railway init

# Add your Anthropic API key as a secret
railway variables set ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=*

# Deploy
railway up
```

### Step 4: Get your backend URL
```bash
railway domain
```

You'll get a URL like: `https://lookr-backend-production.up.railway.app`

### Step 5: Update the app
Open `lookr/app/src/utils/theme.ts` and update:
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://lookr-backend-production.up.railway.app'; // ← Your Railway URL
```

### Alternative: Deploy to Render (also free)
1. Go to **https://render.com** → Sign up
2. New → Web Service → Connect your GitHub repo
3. Add `ANTHROPIC_API_KEY` in Environment Variables
4. Deploy

---

## 5. SET UP THE REACT NATIVE APP

### Step 1: Install app dependencies
```bash
cd lookr/app
npm install
```

### Step 2: iOS – Install CocoaPods (Mac only)
```bash
cd ios
pod install
cd ..
```

### Step 3: Run on Android emulator (testing)
```bash
# Start emulator from Android Studio first, then:
npx react-native run-android
```

### Step 4: Run on iOS simulator (Mac only)
```bash
npx react-native run-ios
```

### Step 5: Run on real Android device
1. Enable Developer Options on your phone:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging: Settings → Developer Options → USB Debugging
3. Connect phone via USB
4. Trust the connection on your phone
```bash
npx react-native run-android
```

---

## 6. BUILD FOR ANDROID (GOOGLE PLAY)

### Step 1: Generate a Signing Keystore
This is your app's permanent identity — **keep it safe forever!**
```bash
cd lookr/app/android/app

keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore lookr-release.keystore \
  -alias lookr-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

When prompted, enter:
- Keystore password: (create a strong password, SAVE IT)
- First and last name: Your name or company name
- Organisation: Your company/app name
- City, State, Country: Your details
- Key password: (same as keystore password is fine)

### Step 2: Create keystore.properties
Create `lookr/app/android/keystore.properties`:
```
storeFile=app/lookr-release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=lookr-key
keyPassword=YOUR_KEY_PASSWORD
```

⚠️ **Add keystore.properties to .gitignore — never commit this!**

### Step 3: Build release AAB (Android App Bundle)
```bash
cd lookr/app/android
./gradlew bundleRelease
```

Your AAB file will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

This is the file you upload to Google Play.

### Step 4: Build release APK (for sideloading/testing)
```bash
./gradlew assembleRelease
```

APK at: `android/app/build/outputs/apk/release/app-release.apk`

---

## 7. BUILD FOR iOS (APP STORE)

### Requirements: Mac computer + Apple Developer Account ($99/year)

### Step 1: Create Apple Developer Account
1. Go to **https://developer.apple.com**
2. Sign up for the Apple Developer Program ($99/year)

### Step 2: Open Xcode
```bash
open lookr/app/ios/Lookr.xcworkspace
```

### Step 3: Configure signing
1. Select the project in Xcode navigator
2. Go to "Signing & Capabilities"
3. Select your Team (your Apple Developer account)
4. Set Bundle Identifier: `com.lookr.app`

### Step 4: Archive for distribution
1. In Xcode: Product → Archive
2. Once done: Window → Organizer
3. Click "Distribute App"
4. Choose "App Store Connect"
5. Follow the wizard

---

## 8. SUBMIT TO GOOGLE PLAY STORE

### Step 1: Create Google Play Developer Account
1. Go to **https://play.google.com/console**
2. Sign in with your Google account
3. Pay one-time $25 registration fee
4. Complete identity verification

### Step 2: Create new app
1. In Play Console: "Create app"
2. App name: **Lookr – Virtual Try On**
3. Default language: English (India)
4. App or game: App
5. Free or paid: Free

### Step 3: Complete Store Listing
Fill in all required fields (see Section 9 for copy):

**App details:**
- App name: `Lookr – Virtual Try On`
- Short description: (see assets section)
- Full description: (see assets section)

**Graphics:**
- App icon: 512×512 PNG (see assets section for spec)
- Feature graphic: 1024×500 PNG
- Screenshots: At least 2 phone screenshots (see spec below)

**Screenshot sizes for Google Play:**
- Phone: 1080×1920 px (portrait) — minimum 2, maximum 8
- Tablet 7": 1200×1920 px (optional)
- Tablet 10": 1600×2560 px (optional)

### Step 4: Content rating
1. Go to "Content rating" in the left menu
2. Fill out the questionnaire
3. Lookr should receive: "Everyone" or "Everyone 10+"

### Step 5: Set up pricing
- Distribution: Select countries (India, US, UK, etc.)
- Price: Free

### Step 6: Upload your AAB
1. Production → Releases → Create release
2. Upload `app-release.aab`
3. Add release notes (see assets section)
4. Review and rollout

### Step 7: Submit for review
Google typically reviews in **1–3 days**.

---

## 9. GOOGLE PLAY STORE LISTING ASSETS

### App Name (30 chars max)
```
Lookr – Virtual Try On
```

### Short Description (80 chars max)
```
Try on clothes from any store instantly using Nano Banana AI. ✨
```

### Full Description (4000 chars max)
```
Lookr brings the future of fashion to your fingertips! 

Virtually try on outfits, clothes, and fashion items instantly — no guesswork, no returns, no more sizing doubts. Simply upload your photo, share a product from your favourite shopping app, and see exactly how it looks on you in seconds using the powerful Nano Banana AI.

✨ KEY FEATURES

🔥 ONE-CLICK VIRTUAL TRY-ON
Share any product from Amazon, Myntra, Ajio, Flipkart, Zara, H&M, or any shopping website and instantly see it on you. Save time and make smarter buying decisions.

📸 TRY REAL-WORLD ITEMS
Snap a picture of clothes in a physical store and try them on virtually before buying. Never waste money on items that don't suit you.

🪆 MANNEQUIN TO MODEL (NEW)
Transform flat mannequin product photos into stunning realistic model shots instantly. See exactly how the item looks when actually worn.

🎨 VIRAL AI AESTHETICS (NEW)
Generate viral AI fashion edits: Y2K, Dark Academia, Cottagecore, Old Money, Streetwear, and more. Create shareable content effortlessly.

🖼️ AI PHOTO EDIT
Auto-enhance, relight, and stylize your fashion photos with one tap. Magazine-quality results in seconds.

👗 SMART WARDROBE
Save your favourite items, organise by category, and mix & match outfits with AI suggestions for every occasion.

📏 SIZE PREDICTOR
AI analyses your body type and recommends the perfect size across Zara, H&M, Levi's, and more.

💡 PERSONAL STYLE ADVISOR
Get AI-powered outfit advice tailored to your body type, occasion, and personal style preferences.

🛍️ WORKS WITH ALL STORES
Amazon, Myntra, Ajio, Flipkart, Zara, H&M, Nykaa Fashion, Meesho, BIBA, FabIndia, and thousands more.

WHY TRYONAI?
✅ Say goodbye to sizing doubts and style uncertainty
✅ Visualise outfits before buying — avoid expensive returns  
✅ Try on from any source: online or offline, anytime
✅ Powered by Nano Banana AI for realistic, accurate results
✅ Save and organise your dream wardrobe

PERFECT FOR:
• Online shoppers who want to see before they buy
• Fashion enthusiasts exploring new styles
• Anyone planning outfits or shopping smarter
• Content creators wanting viral fashion content

HOW IT WORKS:
1. Upload your full-body photo
2. Upload or share any clothing item
3. AI instantly shows how it looks on you
4. Save looks, share, and shop with confidence!

Download Lookr today and transform your shopping experience! 🛍️✨
```

### What's New (Release Notes)
```
Version 1.0.0 – Initial Release! 🎉

• Virtual try-on for any clothing item
• AI Aesthetic Generator (Y2K, Dark Academia & more)
• Mannequin to Model transformation
• Smart Wardrobe with Mix & Match
• Size Predictor
• Personal Style Advisor
• Powered by Nano Banana AI
```

### Keywords / Tags
```
virtual try on, clothes, fashion, outfit, AI fashion, shopping, wardrobe, style, dress up, clothing
```

---

## 10. SCREENSHOT SPECIFICATIONS

For Google Play, create screenshots showing:

**Screenshot 1 – Hero Shot**
Show the main try-on interface with a person photo + clothing item

**Screenshot 2 – Result Screen**  
Show the AI analysis result with outfit description

**Screenshot 3 – AI Studio**
Show the 6 AI features grid

**Screenshot 4 – Wardrobe**
Show a filled wardrobe with multiple items

**Screenshot 5 – Aesthetic Generator**
Show the aesthetic feature with Y2K/Dark Academia options

**Recommended tool to create screenshots:**
- Use **Figma** (free) or **Canva** (free)
- Or take real screenshots on your device
- Size: 1080 × 1920 px (9:16 portrait)
- Add device frame: https://mockuphone.com (free)

---

## 11. APP ICON REQUIREMENTS

### Google Play
- Size: 512 × 512 px
- Format: PNG (no alpha/transparency on background)
- No rounded corners (Google applies them)

### iOS App Store
- Size: 1024 × 1024 px
- Format: PNG
- No transparency
- No rounded corners (Apple applies them)

### Icon Design Idea for Lookr
- Dark background (#0a0a0f)
- Stylised clothing hanger or dress silhouette
- Accent colour (#c8ff3e — the lime green)
- Sparkle/AI effect elements

**Free icon creation tools:**
- https://www.canva.com (free tier)
- https://www.figma.com (free tier)
- https://appicon.co (auto-generates all sizes)

---

## 12. POST-LAUNCH CHECKLIST

### Before Launch
- [ ] Backend deployed and health check returns OK
- [ ] API key configured in Railway/Render
- [ ] App connects to production backend URL
- [ ] Tested on Android 8+ real devices
- [ ] Tested on iOS 14+ (if applicable)
- [ ] Privacy Policy published (see below)
- [ ] All Play Store listing fields filled
- [ ] Screenshots uploaded (minimum 2)
- [ ] App icon uploaded
- [ ] Content rating completed

### Privacy Policy (Required by Google Play)
You MUST have a privacy policy. Use this free tool:
**https://www.privacypolicygenerator.info** (free)

Key points to include:
- What data you collect (images uploaded)
- How you use it (sent to AI for processing)
- Third-party services: Anthropic/Claude API
- Data retention: images not stored permanently
- Contact email

Host it on GitHub Pages (free):
1. Create a GitHub repo
2. Add your privacy policy as `index.html`
3. Enable GitHub Pages in Settings
4. Your URL: `https://yourusername.github.io/tryon-privacy`

### After Launch
- [ ] Monitor Railway/Render logs for errors
- [ ] Set up Anthropic API spending alerts at console.anthropic.com
- [ ] Respond to Play Store reviews
- [ ] Monitor crash reports in Play Console

---

## QUICK REFERENCE – USEFUL URLS

| Resource | URL |
|----------|-----|
| Anthropic Console | https://console.anthropic.com |
| Google Play Console | https://play.google.com/console |
| Railway (backend host) | https://railway.app |
| Render (alt backend) | https://render.com |
| React Native Docs | https://reactnative.dev |
| Privacy Policy Generator | https://www.privacypolicygenerator.info |
| App Icon Generator | https://appicon.co |
| Screenshot Mockups | https://mockuphone.com |

---

## SUPPORT

If you run into issues:
- React Native: https://reactnative.dev/docs/environment-setup
- Anthropic API: https://docs.anthropic.com
- Railway: https://docs.railway.app

---

*Lookr – Built with React Native + Nano Banana AI*
*Guide version 1.0 | March 2026*
