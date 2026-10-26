# SparkSync

SparkSync is a mobile-first React and Vite app from Radiant Spark LLC. The current release is a polished product preview with a dashboard, task list, wellness screens, market watchlist, practice prediction markets, news cards, gallery, and 3D visuals.

## Run the app

- Install Node.js 20 or newer.
- Run `npm install`.
- Run `npm run dev` and open the local URL printed in the terminal.
- Run `npm run build` to create the production files in `dist/`.
- Run `npm start` with `NODE_ENV=production` after building to serve the production app.

## Current release status

This release uses sample wellness, market, and news data. It does not connect to Apple HealthKit, Health Connect, Oura, Garmin, or WHOOP. Device linking is a preview flow only; displayed pulse and other health values are not live measurements.

Prediction markets are paper-trading demonstrations. Their events, prices, balance, orders, and fee estimates are sample data. There are no real-money trades or payouts. Stock prices and news are not live feeds.

Stripe is not configured. The checkout endpoint intentionally reports that setup is required and does not take payment or unlock a paid plan. Before charging customers, implement hosted Stripe Checkout with recurring Price IDs, signed webhook handling, user authentication, and a database to verify and store subscription status. Keep secret keys on the server; never put them in the browser or upload them to GitHub.

## Before a customer launch

- Connect actual wearable data through supported native iOS/Android integrations with explicit user consent.
- Choose licensed and reliable market/news data providers and show timestamps and source information.
- Add account authentication and a server-side database for customer profiles, subscriptions, and settings.
- Complete Stripe Checkout, webhook verification, cancellations, refunds, and subscription access checks.
- Review product, health, privacy, financial, and prediction-market requirements for your target regions.

See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for preparing the source archive and deploying the Node app.
