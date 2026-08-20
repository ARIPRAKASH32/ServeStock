import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All user routes are restricted to ADMIN only
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id/status')
  .patch(updateUserStatus);

router.route('/:id/role')
  .patch(updateUserRole);

router.route('/:id/password')
  .patch(resetUserPassword);

export default router;
