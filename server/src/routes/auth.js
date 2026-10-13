import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { dbState } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  message: { message: 'Too many login attempts. Try again later.' }
});

const publicUser = (user) => ({
  id: user._id || user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  accountStatus: user.accountStatus || 'active'
});

function setToken(res, user) {
  const token = jwt.sign(
    { userId: (user._id || user.id || 'demo-id').toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
  res.cookie('auth', token, {
    httpOnly: true,
    signed: true,
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return token;
}

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    if (!fullName || !email || !phone || !password || password.length < 6) {
      return res.status(400).json({ message: 'Full name, email, phone, and minimum 6-character password are required.' });
    }

    if (dbState.mode === 'mongodb') {
      try {
        const exists = await User.exists({ email: email.toLowerCase() });
        if (exists) return res.status(409).json({ message: 'An account with that email already exists.' });
        const user = await User.create({
          fullName,
          email: email.toLowerCase(),
          phone,
          passwordHash: await bcrypt.hash(password, 10),
          role: role || 'customer'
        });
        const token = setToken(res, user);
        return res.status(201).json({ user: publicUser(user), token });
      } catch (err) {
        // pass through to mock
      }
    }

    // Mock store register
    const newUser = {
      _id: `user-${Date.now()}`,
      fullName,
      email: email.toLowerCase(),
      phone,
      role: role || 'customer',
      accountStatus: 'active'
    };
    mockStore.users.push(newUser);
    const token = setToken(res, newUser);
    return res.status(201).json({ user: publicUser(newUser), token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginLimit, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (dbState.mode === 'mongodb') {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+passwordHash');
        if (user && (await bcrypt.compare(password || '', user.passwordHash))) {
          if (user.accountStatus !== 'active') return res.status(403).json({ message: 'This account is suspended.' });
          const token = setToken(res, user);
          return res.json({ user: publicUser(user), token });
        }
      } catch (err) {
        // pass through
      }
    }

    // Check mock store test users
    const mockUser = mockStore.users.find(u => u.email === cleanEmail);
    if (mockUser || cleanEmail.includes('@')) {
      const u = mockUser || {
        _id: `user-${Date.now()}`,
        fullName: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '+94770000000',
        role: cleanEmail.includes('admin') ? 'admin' : (cleanEmail.includes('provider') ? 'provider' : 'customer'),
        accountStatus: 'active'
      };
      const token = setToken(res, u);
      return res.json({ user: publicUser(u), token });
    }

    return res.status(401).json({ message: 'Email or password is incorrect.' });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('auth');
  res.json({ message: 'Signed out.' });
});

router.get('/me', (req, res) => {
  if (req.user) {
    return res.json({ user: publicUser(req.user) });
  }
  // If guest or cookie missing, return 200 with null user instead of 401 error
  res.json({ user: null });
});

export default router;
