import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Purchase from '../models/Purchase';
import Ingredient from '../models/Ingredient';
import { z } from 'zod';
import { logActivity } from '../utils/activityLogger';

const purchaseSchema = z.object({
  ingredientName: z.string(),
  categoryId: z.string(),
  quantity: z.number().min(0.01),
  unit: z.string(),
  unitPrice: z.number().min(0),
  purchaseDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()),
  supplierId: z.string().optional(),
});

export const getPurchases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      res.status(403).json({ success: false, message: 'User does not belong to a restaurant' });
      return;
    }

    const purchases = await Purchase.find({ restaurantId }).sort({ purchaseDate: -1 });
    res.status(200).json({ success: true, data: purchases });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPurchaseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId });
    if (!purchase) {
      res.status(404).json({ success: false, message: 'Purchase not found' });
      return;
    }
    res.status(200).json({ success: true, data: purchase });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordPurchase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      res.status(403).json({ success: false, message: 'User does not belong to a restaurant' });
      return;
    }

    const parsedData = purchaseSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const { ingredientName, categoryId, quantity, unit, unitPrice, purchaseDate, expiryDate, supplierId } = parsedData.data;

    // Server calculated total price
    const totalPrice = quantity * unitPrice;

    // Record the purchase
    const purchase = await Purchase.create({
      ingredientName,
      categoryId,
      quantity,
      unit,
      unitPrice,
      totalPrice,
      purchaseDate,
      expiryDate,
      supplierId,
      restaurantId,
    });

    // We might also want to automatically update the Ingredient stock here.
    // Let's try to find an existing ingredient by name, if it exists, update it.
    let ingredient = await Ingredient.findOne({ name: ingredientName, restaurantId });
    
    if (ingredient) {
      ingredient.quantity += quantity;
      // Optionally update the average purchase price here if needed
      ingredient.purchasePrice = unitPrice; 
      ingredient.expiryDate = new Date(expiryDate);
      await ingredient.save();
    } else {
      // If it doesn't exist, we could auto-create it (simplification for this system)
      await Ingredient.create({
        name: ingredientName,
        category: categoryId,
        quantity,
        unit,
        minimumStockLevel: 5, // Default
        purchasePrice: unitPrice,
        purchaseDate,
        expiryDate,
        restaurantId,
      });
    }

    if (req.user) {
      await logActivity(
        req.user._id, 
        restaurantId, 
        'RECORDED_PURCHASE', 
        'Purchase', 
        purchase._id.toString(), 
        { ingredientName, quantity, totalPrice }
      );
    }

    res.status(201).json({ success: true, data: purchase });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
