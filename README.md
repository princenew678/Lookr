# Lookr – AI Virtual Try On
### Cross-Platform React Native App + Node.js Backend
> See the look before you buy — powered by **Nano Banana AI**

---

## Project Structure

```
lookr/
├── app/                        ← React Native (iOS + Android)
│   └── src/
│       ├── screens/
│       │   ├── OnboardingScreen.tsx
│       │   ├── TryOnScreen.tsx          ← Core feature
│       │   ├── TryOnResultScreen.tsx
│       │   ├── WardrobeScreen.tsx
│       │   ├── AIStudioScreen.tsx
│       │   ├── AIStudioFeatureScreen.tsx
│       │   ├── HistoryScreen.tsx
│       │   └── ProfileScreen.tsx
│       ├── navigation/
│       ├── services/api.ts      ← Backend API calls
│       ├── store/appStore.ts    ← Zustand (wardrobe + history)
│       └── utils/theme.ts       ← Colours, spacing, API URL
│
├── backend/                    ← Node.js Express server
│   └── src/
│       ├── server.js
│       ├── routes/
│       │   ├── tryon.js         ← POST /api/tryon
│       │   ├── studio.js        ← POST /api/studio
│       │   ├── product.js       ← POST /api/product/fetch
│       │   └── health.js        ← GET /health
│       └── services/
│           └── nanoBanana.js    ← All Anthropic API calls
│
└── docs/
    ├── DEPLOYMENT_GUIDE.md     ← Step-by-step to Play Store
    └── PLAY_STORE_ASSETS.md    ← All copy, keywords, checklist
```

---

## Quick Start

```bash
# 1. Backend
cd backend
cp .env.example .env
# → Add your ANTHROPIC_API_KEY to .env
npm install && npm run dev

# 2. App
cd app
npm install
npx react-native run-android   # or run-ios
```

---

## Features

| Feature | Description |
|---|---|
| ✨ Virtual Try-On | Photo + clothing → instant AI analysis |
| 🔗 Product URL | Paste any Amazon / Myntra / Ajio / Zara link |
| 🪆 Mannequin → Model | Transform product photos to model shots |
| 📷 Snap & Try | Camera snap from a physical store |
| 🎨 AI Aesthetics | Y2K, Dark Academia, Cottagecore & more |
| 🖼️ AI Photo Edit | Auto-enhance fashion photos |
| 🔀 Mix & Match | AI outfit combos from your wardrobe |
| 📏 Size Advisor | AI sizing across all major brands |
| 💡 Style Advisor | Personalised style recommendations |
| 👗 Wardrobe | Save, organise, manage all your looks |
| 🕐 History | All past try-ons with like / delete |

---

## Deploy to Google Play

Full instructions → **docs/DEPLOYMENT_GUIDE.md**

```bash
# 1. Get API key  → console.anthropic.com
# 2. Deploy backend
cd backend && railway up

# 3. Update API URL in app/src/utils/theme.ts

# 4. Build release bundle
cd app/android && ./gradlew bundleRelease
# → upload app-release.aab to Google Play Console
```

---

## App Identity

| Field | Value |
|---|---|
| App Name | Lookr |
| Tagline | See the look before you buy |
| Android Package | com.lookr.app |
| iOS Bundle ID | com.lookr.app |
| Version | 1.0.0 |
| Category | Shopping |

---

## Tech Stack

**App:** React Native 0.73 · React Navigation 6 · Zustand · AsyncStorage · react-native-image-picker

**Backend:** Node.js · Express · Anthropic Claude API (Nano Banana) · Cheerio · Winston · Helmet

**Deploy:** Railway / Render (backend) · Google Play Store / Apple App Store (app)

---

## Costs at a Glance

| Item | Cost |
|---|---|
| Anthropic API key | Free to create |
| New account AI credits | $5 free |
| Per try-on call | ~$0.005–0.02 |
| Railway backend hosting | Free tier |
| Google Play account | $25 one-time |
| Apple Developer (iOS) | $99/year |

---

*Lookr v1.0.0 · Powered by Nano Banana AI*
