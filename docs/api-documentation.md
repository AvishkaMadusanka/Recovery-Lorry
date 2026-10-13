# API documentation

The API is rooted at `/api`. Authentication uses a signed, HttpOnly `auth` cookie. Bearer tokens are also accepted for API clients. Every protected operation checks the authenticated role and resource ownership.

## Authentication

- `POST /auth/register` with `fullName`, `email`, `phone`, `password`
- `POST /auth/login` with `email`, `password`
- `POST /auth/logout`
- `GET /auth/me`

## Providers and vehicles

- `POST /providers/register` creates a pending provider profile for an authenticated customer.
- `GET|PUT /providers/me` reads or updates the authenticated provider.
- `GET /vehicles/nearby?latitude=7.2906&longitude=80.6337&radiusKm=25` returns nearby available vehicles for an authenticated customer or admin. Radius must be 5, 10, 25, or 50 km.
- `GET /vehicles` lists the authenticated provider's vehicles.
- `POST /vehicles` creates an approved provider vehicle.
- `PATCH /vehicles/:id/availability` changes availability.
- `PATCH /vehicles/:id/location` updates a provider-authorized GeoJSON location.

## Bookings

- `POST /bookings` creates a pending booking and server-calculates the estimate.
- `GET /bookings/my-bookings` lists the customer's bookings.
- `GET /bookings/provider-requests` lists the provider's bookings.
- `GET /bookings/:id` enforces customer/provider ownership.
- `PATCH /bookings/:id/accept`, `/reject`, `/status`, and `/cancel` enforce the transition table: pending -> accepted/rejected/cancelled -> on_the_way -> arrived -> in_progress -> completed.

## Supporting workflows

- `GET /notifications`, `PATCH /notifications/:id/read`
- `POST /reviews`, `GET /reviews/provider/:providerId`
- `POST /complaints`, `GET /complaints/my-complaints`
- `GET /admin/dashboard`, `/admin/providers`, `/admin/bookings`, `/admin/complaints`
- `PATCH /admin/providers/:id/approve|reject|suspend|reactivate`

All validation and database errors use JSON `{ "message": "..." }` with conventional 400, 401, 403, 404, and 409 status codes.
