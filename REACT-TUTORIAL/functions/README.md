README - Firebase Functions for Mercado Pago

This folder contains minimal Firebase Cloud Functions to create Mercado Pago checkout preferences and to handle MP webhooks.

Setup
1. Install dependencies:
   cd functions
   npm install

2. Set your Mercado Pago access token in Firebase functions config:
   firebase functions:config:set mercadopago.token="YOUR_MP_ACCESS_TOKEN"

3. (Optional) set WEB_HOST for back_urls if different from localhost:
   firebase functions:config:set app.web_host="https://yourdomain.com"

4. Deploy:
   firebase deploy --only functions

Seed Firestore with example plans
1. To create example plan documents in your Firestore run the seed script (local or deployed with proper admin credentials):

   node seedPlans.js

2. If using Firebase Emulator Suite, start the emulator and run the seed script with the emulator environment:

   firebase emulators:start --only firestore,functions
   # In another terminal (or with NODE environment pointed to emulator) run:
   node seedPlans.js

Endpoints exposed (after deploy):
- POST https://<REGION>-<PROJECT>.cloudfunctions.net/api/create-preference
  Body: { planId, userId }
  Returns: { init_point, preference_id }

- POST https://<REGION>-<PROJECT>.cloudfunctions.net/api/mp-webhook
  (Mercado Pago webhook URL)

Notes
- Do NOT expose your Mercado Pago access token in the frontend. Always call the backend endpoint which holds the token.
- This is a minimal example. Add authentication checks, better error handling, logging and idempotency for production.
