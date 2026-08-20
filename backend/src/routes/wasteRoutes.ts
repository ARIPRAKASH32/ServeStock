import express from 'express';
import { getWasteRecords, getWasteRecordById, recordWaste, deleteWasteRecord } from '../controllers/wasteController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getWasteRecords);
router.get('/:id', getWasteRecordById);
router.post('/', authorize('ADMIN', 'RESTAURANT_MANAGER', 'STAFF'), recordWaste); // Staff can record waste
router.delete('/:id', authorize('ADMIN', 'RESTAURANT_MANAGER'), deleteWasteRecord);

export default router;
