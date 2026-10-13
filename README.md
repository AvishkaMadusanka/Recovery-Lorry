# RescueNow

RescueNow is a MERN platform for finding and booking verified recovery lorries in Sri Lanka.

## Quick start

Prerequisites: Node.js 20+, npm, and MongoDB (local or Atlas).

```bash
npm run install:all
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
npm run dev
```

The web app runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## Commands

- `npm run dev` starts client and server together.
- `npm run build` creates the production client build.
- `npm test` runs server and client tests.
- `npm run seed` inserts development-only sample records.

See [docs/database-design.md](docs/database-design.md) and [docs/api-documentation.md](docs/api-documentation.md) for the data model and API contract.

## MongoDB and admin setup

Set `MONGODB_URI` in `server/.env` to a local MongoDB database or an Atlas connection string. Seed development records with `npm run seed`. This creates clearly labeled test accounts using the password shown by the command; do not use those credentials outside development.

Create the first administrator without placing credentials in a file. In PowerShell, set `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PHONE`, and a random `ADMIN_PASSWORD` of at least 16 characters for the command session, then run `npm run create-admin --prefix server`. Remove those shell variables afterward.

The basic map flow uses browser geolocation and OpenStreetMap-compatible configuration. The current UI provides a manual location fallback; production deployments should configure a permitted tile host and a reliable routing provider rather than relying on public demo infrastructure.

## Security and production notes

Use HTTPS, a strong random `JWT_SECRET` and `COOKIE_SECRET`, a specific `CLIENT_URL`, secure cookies, MongoDB network restrictions, and a managed image storage service for uploads. No online payment is claimed: initial payment records are cash and remain pending until an authorized workflow records payment.
