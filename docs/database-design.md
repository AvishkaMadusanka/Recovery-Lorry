# Database design

RescueNow uses MongoDB collections with Mongoose references:

- `users`: identity, role, account status, and a select-hidden bcrypt password hash.
- `providers`: one-to-one with `users`; business information and approval status.
- `recoveryvehicles`: many-to-one with `providers`; pricing, availability, and GeoJSON location.
- `bookings`: links one customer, provider, and vehicle; embeds pickup/destination locations and status history.
- `reviews`: one per completed booking, linked to customer and provider.
- `notifications`: recipient and optional booking references for in-app updates.
- `payments`: one cash payment record per booking, ready for verified gateway integration later.
- `complaints`: customer issues linked optionally to a booking.
- `auditlogs`: administrative and sensitive action history.

Important indexes include unique normalized user email, provider user reference, booking reference, provider/registration number, status fields, and `recoveryvehicles.currentLocation` as a MongoDB `2dsphere` index. Vehicle nearby search uses GeoJSON `[longitude, latitude]`, filters approved providers and active accounts, excludes stale coordinates, and sorts by MongoDB geospatial distance.
