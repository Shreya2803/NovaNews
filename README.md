# NovaNews Frontend

This is the Expo frontend for the NovaNews project. It uses Expo Router, Clerk authentication, NativeWind for Tailwind-style styling, Mediastack for news data, and the Google Generative AI SDK for article analysis.

Live Link : https://novanews-ai.lovable.app/

## 🚀 Mandatory Run Steps

1. Open a terminal.
2. Change into the frontend folder:
   ```sh
   cd frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create or update your `.env` file with the required API keys (see below).
5. Start Expo:
   ```sh
   npm start
   ```
6. Open the app in the Expo Dev Tools, then choose emulator/device/web.

> If styles do not appear correctly, restart Expo with a clean cache:
> ```sh
> npm start -- --clean
> ```

## 📁 Architecture Overview

The frontend is built with Expo and Expo Router using a file-based routing model.

- `src/app/_layout.tsx` — Top-level app layout and Clerk provider.
- `src/app/(app)/sign-in.tsx` — Sign-in screen with email/password and Google OAuth support.
- `src/app/(app)/sign-up.tsx` — Sign-up screen and email verification flow.
- `src/app/(app)/(tabs)/index.tsx` — Main news feed screen with category browsing.
- `src/app/(app)/(tabs)/search.tsx` — Search screen querying the news API.
- `src/app/api/ainews+api.ts` — Server-side API route used for article analysis with Gemini.
- `src/components/GoogleSignIn.tsx` — Google OAuth button and Clerk SSO flow.

### Styling

- `global.css` loads Tailwind base/components/utilities.
- `tailwind.config.js` is configured for NativeWind.
- `babel.config.js` includes `nativewind/babel`.

### Auth

- Authentication is handled by Clerk via `@clerk/clerk-expo`.
- `ClerkProvider` is configured in `src/app/_layout.tsx`.
- Sign-in and sign-up flows are implemented using Clerk hooks.

### Data and APIs

- News content comes from the Mediastack API.
- Search and category requests use `process.env.EXPO_PUBLIC_MEDIASTACK_API_KEY`.
- Article analysis uses `@google/generative-ai` in `src/app/api/ainews+api.ts`.

## 📦 Main Packages

- `expo` — Expo runtime
- `expo-router` — File-based routing
- `nativewind` — Tailwind styling for React Native
- `@clerk/clerk-expo` — Clerk authentication
- `@google/generative-ai` — Google Gemini AI SDK
- `react-native-safe-area-context` — Safe area support
- `react-native-reanimated` — Animations and gestures
- `cheerio` — HTML parsing if needed
- `tailwindcss` — Tailwind utility classes

## 🔐 Environment Keys

Create a file at `frontend/.env` with these values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
EXPO_PUBLIC_MEDIASTACK_API_KEY=your_mediastack_access_key
GEMINI_API_KEY=your_gemini_api_key
```

### Where to get each key

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
  - Get them from your Clerk dashboard under API keys.
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is used by the client.
  - `CLERK_SECRET_KEY` is used by server-side Clerk internals.

- `EXPO_PUBLIC_MEDIASTACK_API_KEY`
  - Get from Mediastack: https://mediastack.com/
  - Used for news feed and search requests in the app.

- `GEMINI_API_KEY`
  - Get from Google Cloud or your Google Gemini/Generative AI provider.
  - Used in `src/app/api/ainews+api.ts` to analyze news article content.

## ⚠️ Important Notes

- `.env` is ignored by Git, so keep it private.
- `EXPO_PUBLIC_*` prefixed variables are exposed to the Expo client.
- `GEMINI_API_KEY` is used only server-side in the API route.

## 🛠️ Useful Commands

```sh
npm start       # Start Expo dev server
npm run android # Open Android emulator
npm run ios     # Open iOS simulator
npm run web     # Run web version
```
