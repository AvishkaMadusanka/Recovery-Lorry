import { Router } from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/', requireAuth, async (req, res, next) => { try { res.json({ notifications: await Notification.find({ recipientId: req.user._id }).sort({ createdAt: -1 }).limit(50) }); } catch (error) { next(error); } });
router.patch('/:id/read', requireAuth, async (req, res, next) => { try { const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipientId: req.user._id }, { isRead: true }, { new: true }); if (!notification) return res.status(404).json({ message: 'Notification not found.' }); res.json({ notification }); } catch (error) { next(error); } });
export default router;
