import 'dotenv/config';

const required = ['JWT_SECRET', 'MONGODB_URI'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV === 'production') {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rescuenow',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieSecret: process.env.COOKIE_SECRET || 'development-cookie-secret',
  staleLocationMinutes: Number(process.env.STALE_LOCATION_MINUTES || 30)
};
