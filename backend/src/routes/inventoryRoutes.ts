import express from 'express';
import { getInventory, getIngredientById, addIngredient, updateIngredient, deleteIngredient, updateStock } from '../controllers/inventoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All inventory routes require auth

router.get('/', getInventory);
router.get('/:id', getIngredientById);

// Only Managers and Admins can perform these actions, or maybe staff depending on requirements.
// The prompt says "Staff: Update stock". Let's allow staff to update, but maybe only managers can add/delete.
router.post('/', authorize('ADMIN', 'RESTAURANT_MANAGER'), addIngredient);
router.put('/:id', authorize('ADMIN', 'RESTAURANT_MANAGER', 'STAFF'), updateIngredient);
router.delete('/:id', authorize('ADMIN', 'RESTAURANT_MANAGER'), deleteIngredient);

router.post('/:id/stock', authorize('ADMIN', 'RESTAURANT_MANAGER', 'STAFF'), updateStock);

export default router;
