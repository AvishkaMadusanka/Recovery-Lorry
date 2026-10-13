import { Router } from 'express';
import Provider from '../models/Provider.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();
router.post('/register', requireAuth, allowRoles('customer'), async (req, res, next) => { try { const exists = await Provider.exists({ userId: req.user._id }); if (exists) return res.status(409).json({ message: 'A provider profile already exists.' }); const provider = await Provider.create({ ...req.body, userId: req.user._id }); req.user.role = 'provider'; await req.user.save(); res.status(201).json({ provider }); } catch (error) { next(error); } });
router.get('/me', requireAuth, allowRoles('provider'), async (req, res, next) => { try { const provider = await Provider.findOne({ userId: req.user._id }); res.json({ provider }); } catch (error) { next(error); } });
router.put('/me', requireAuth, allowRoles('provider'), async (req, res, next) => { try { const provider = await Provider.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true, runValidators: true }); res.json({ provider }); } catch (error) { next(error); } });
export default router;
