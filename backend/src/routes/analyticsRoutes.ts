import express from 'express';
import { getAdminDashboard, getManagerDashboard, getStaffDashboard, getWasteAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/dashboard/admin', authorize('ADMIN'), getAdminDashboard);
router.get('/dashboard/manager', authorize('ADMIN', 'RESTAURANT_MANAGER'), getManagerDashboard);
router.get('/dashboard/staff', authorize('ADMIN', 'RESTAURANT_MANAGER', 'STAFF'), getStaffDashboard);

router.get('/waste', authorize('ADMIN', 'RESTAURANT_MANAGER'), getWasteAnalytics);

export default router;
