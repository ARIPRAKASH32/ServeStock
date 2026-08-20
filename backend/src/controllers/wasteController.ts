import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import WasteRecord from '../models/WasteRecord';
import Ingredient from '../models/Ingredient';
import { z } from 'zod';
import { logActivity } from '../utils/activityLogger';

const wasteSchema = z.object({
  ingredientId: z.string(),
  quantity: z.number().min(0.01),
  reason: z.enum(['EXPIRED', 'SPOILED', 'OVERPRODUCTION', 'DAMAGED', 'PREPARATION_WASTE', 'CUSTOMER_RETURN', 'OTHER']),
  date: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
});

export const getWasteRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      res.status(403).json({ success: false, message: 'User does not belong to a restaurant' });
      return;
    }

    const wasteRecords = await WasteRecord.find({ restaurantId })
      .populate('ingredientId', 'name category unit')
      .populate('userId', 'name')
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: wasteRecords });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWasteRecordById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await WasteRecord.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId })
      .populate('ingredientId', 'name category unit')
      .populate('userId', 'name');
      
    if (!record) {
      res.status(404).json({ success: false, message: 'Waste record not found' });
      return;
    }
    res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordWaste = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      res.status(403).json({ success: false, message: 'User does not belong to a restaurant' });
      return;
    }

    const parsedData = wasteSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const { ingredientId, quantity, reason, notes, date } = parsedData.data;

    const ingredient = await Ingredient.findOne({ _id: ingredientId, restaurantId });
    if (!ingredient) {
      res.status(404).json({ success: false, message: 'Ingredient not found' });
      return;
    }

    if (ingredient.quantity < quantity) {
      res.status(400).json({ success: false, message: 'Waste quantity exceeds current stock' });
      return;
    }

    // Calculate cost based on current purchase price
    const cost = quantity * ingredient.purchasePrice;

    const wasteRecord = await WasteRecord.create({
      ingredientId,
      restaurantId,
      userId: req.user?._id,
      quantity,
      reason,
      cost, // Server calculated
      date: date || new Date(),
      notes,
    });

    // Update inventory quantity
    ingredient.quantity -= quantity;
    await ingredient.save();

    if (req.user) {
      await logActivity(
        req.user._id, 
        restaurantId, 
        'RECORDED_WASTE', 
        'WasteRecord', 
        wasteRecord._id.toString(), 
        { ingredientName: ingredient.name, quantity, cost }
      );
    }

    res.status(201).json({ success: true, data: wasteRecord });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWasteRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await WasteRecord.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId });
    if (!record) {
      res.status(404).json({ success: false, message: 'Waste record not found' });
      return;
    }

    // Optionally: if a waste record is deleted, should the stock be restored? 
    // In many systems, reversing waste is allowed, but for simplicity here we just delete the record.
    // If needed, we can do:
    // const ingredient = await Ingredient.findById(record.ingredientId);
    // if(ingredient) { ingredient.quantity += record.quantity; await ingredient.save(); }

    await record.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
