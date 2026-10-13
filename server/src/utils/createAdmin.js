import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import User from '../models/User.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;
if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 16) throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, and a 16+ character ADMIN_PASSWORD in the shell environment.');
await connectDatabase();
await User.create({ fullName: ADMIN_NAME, email: ADMIN_EMAIL, phone: ADMIN_PHONE, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'admin' });
console.log(`Created administrator ${ADMIN_EMAIL}.`);
await disconnectDatabase();
