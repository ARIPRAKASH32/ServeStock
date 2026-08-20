import express from 'express';
import { getPurchases, getPurchaseById, recordPurchase } from '../controllers/purchaseController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

// Purchases should probably be restricted to Managers/Admins
router.get('/', authorize('ADMIN', 'RESTAURANT_MANAGER'), getPurchases);
router.get('/:id', authorize('ADMIN', 'RESTAURANT_MANAGER'), getPurchaseById);
router.post('/', authorize('ADMIN', 'RESTAURANT_MANAGER'), recordPurchase);

export default router;
