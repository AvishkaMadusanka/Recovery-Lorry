import { Router } from 'express';
import Complaint from '../models/Complaint.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/', requireAuth, allowRoles('customer'), async (req, res, next) => { try { const complaint = await Complaint.create({ ...req.body, customerId: req.user._id }); res.status(201).json({ complaint }); } catch (error) { next(error); } });
router.get('/my-complaints', requireAuth, allowRoles('customer'), async (req, res, next) => { try { res.json({ complaints: await Complaint.find({ customerId: req.user._id }).sort({ createdAt: -1 }) }); } catch (error) { next(error); } });
export default router;
