import express from 'express';
import { getRecommendations } from '../controllers/recommendationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'RESTAURANT_MANAGER'));

router.get('/', getRecommendations);

export default router;
