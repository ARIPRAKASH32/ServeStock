import express from 'express';
import { trackEvent, getExperimentResults } from '../controllers/experimentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Anyone (even unauthenticated) might trigger an A/B test event in some apps, 
// but here we expect staff/managers. We can make protect optional or required.
router.post('/events', trackEvent);

router.get('/:id/results', protect, authorize('ADMIN', 'RESTAURANT_MANAGER'), getExperimentResults);

export default router;
