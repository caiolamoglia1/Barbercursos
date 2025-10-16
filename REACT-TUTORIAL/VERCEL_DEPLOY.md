Vercel deploy (quick)

1) Create a project on Vercel and connect the GitHub repo.

2) Add Environment Variables in the Vercel project settings (Preview/Production):
   - STRIPE_SECRET = sk_test_...
   - STRIPE_WEBHOOK_SECRET = whsec_...
   - FIREBASE_SERVICE_ACCOUNT = (JSON contents of service account key) -- set as a single-line JSON string
   - SUCCESS_URL = https://your-domain/success
   - CANCEL_URL = https://your-domain/planos

3) Deploy: Vercel will detect `api/` folder and create serverless functions for each file.

4) Configure Stripe webhook: in the Stripe Dashboard add an endpoint for
   https://<your-vercel-project>.vercel.app/api/stripe-webhook
   and add the webhook secret to `STRIPE_WEBHOOK_SECRET` env var.

5) Test: open the frontend, click a plan, it will call `/api/create-checkout-session` and return a `url` to redirect the user.

Notes:
- For local testing before deploy, install the Vercel CLI and run `vercel dev` with the environment variables set.
- Ensure the `FIREBASE_SERVICE_ACCOUNT` JSON has permission to write to Firestore (service account with role Editor or custom minimal role).
