# GitHub upload and deployment

## Upload the source to GitHub

1. Download and extract `sparksync-github-upload.zip`.
2. Open your GitHub repository and choose **Add file → Upload files**.
3. Upload the extracted project files and folders (including `src`, `public`, `package.json`, and `package-lock.json`). Do not upload `node_modules`, `.env`, or any API secret.
4. Commit the upload. A GitHub repository stores the source; it does not automatically publish this Node app unless you connect a deployment service.

## Deploy the app

This project is a Vite frontend served by an Express Node server. A Node-capable host can run:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Set `NODE_ENV=production`
- Set `PORT` as required by the host

If you upload only the `dist` folder to static hosting, the visual frontend can load, but Express API features will not run. The current Stripe endpoint deliberately returns a setup-required response. The Gemini assistant also needs a server-side `GEMINI_API_KEY` if you enable it.

## Payment and account setup still required

The project does not currently take payments or activate subscriptions. Before enabling subscriptions, create recurring Basic and Pro prices in Stripe, implement actual hosted Checkout, verify signed Stripe webhooks on the server, and store verified customer entitlements in an authenticated database. Never put a Stripe secret key in React code, browser storage, or a GitHub repository. Do not treat a locally selected plan as proof of payment.

## Data and device integrations

Health values, market quotes, prediction events, news cards, and the paper-trading balance are sample content. Device linking is a visual preview; the web app does not access wearable data. Do not advertise these values as live until supported native HealthKit/Health Connect connections and real market/news data providers are implemented and tested.
