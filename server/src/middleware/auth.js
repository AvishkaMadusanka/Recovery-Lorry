import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { dbState } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.signedCookies.auth || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = jwt.verify(token, env.jwtSecret);
    let user = null;

    if (dbState.mode === 'mongodb') {
      try {
        user = await User.findById(payload.userId);
      } catch (err) {
        // fallback to mock
      }
    }

    if (!user) {
      user = mockStore.users.find(u => u._id === payload.userId || u.id === payload.userId) || {
        _id: payload.userId,
        fullName: 'Customer',
        email: 'customer@rescuenow.lk',
        phone: '+94770000001',
        role: payload.role || 'customer',
        accountStatus: 'active'
      };
    }

    if (!user || user.accountStatus !== 'active') {
      return res.status(401).json({ message: 'Account is unavailable.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired authentication.' });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action.' });
    }
    next();
  };
}
