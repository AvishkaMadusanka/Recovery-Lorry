import { Router } from 'express';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Provider from '../models/Provider.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/', requireAuth, allowRoles('customer'), async (req, res, next) => { try { const booking = await Booking.findOne({ _id: req.body.bookingId, customerId: req.user._id, status: 'completed' }); if (!booking) return res.status(400).json({ message: 'Only completed bookings can be reviewed.' }); const review = await Review.create({ bookingId: booking._id, customerId: req.user._id, providerId: booking.providerId, rating: req.body.rating, comment: req.body.comment }); const stats = await Review.aggregate([{ $match: { providerId: booking.providerId } }, { $group: { _id: '$providerId', average: { $avg: '$rating' } } }]); await Provider.findByIdAndUpdate(booking.providerId, { averageRating: stats[0]?.average || 0 }); res.status(201).json({ review }); } catch (error) { next(error); } });
router.get('/provider/:providerId', async (req, res, next) => { try { res.json({ reviews: await Review.find({ providerId: req.params.providerId }).sort({ createdAt: -1 }) }); } catch (error) { next(error); } });
export default router;
