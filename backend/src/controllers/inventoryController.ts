import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Ingredient from '../models/Ingredient';
import { z } from 'zod';
import { logActivity } from '../utils/activityLogger';

const ingredientSchema = z.object({
  name: z.string(),
  category: z.string(),
  quantity: z.number().min(0),
  unit: z.string(),
  minimumStockLevel: z.number().min(0),
  purchasePrice: z.number().min(0),
  expiryDate: z.string().or(z.date()),
});

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      res.status(403).json({ success: false, message: 'User does not belong to a restaurant' });
      return;
    }

    const inventory = await Ingredient.find({ restaurantId }).sort({ name: 1 });
    res.status(200).json({ success: true, data: inventory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIngredientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId });
    if (!ingredient) {
      res.status(404).json({ success: false, message: 'Ingredient not found' });
      return;
    }
    res.status(200).json({ success: true, data: ingredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addIngredient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      res.status(403).json({ success: false, message: 'User does not belong to a restaurant' });
      return;
    }

    const parsedData = ingredientSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const ingredient = await Ingredient.create({
      ...parsedData.data,
      restaurantId,
    });

    if (req.user) {
      await logActivity(
        req.user._id, 
        restaurantId, 
        'ADDED_INGREDIENT', 
        'Ingredient', 
        ingredient._id.toString(), 
        { name: ingredient.name }
      );
    }

    res.status(201).json({ success: true, data: ingredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIngredient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId });
    if (!ingredient) {
      res.status(404).json({ success: false, message: 'Ingredient not found' });
      return;
    }

    // Partial update validation
    const parsedData = ingredientSchema.partial().safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { $set: parsedData.data },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedIngredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteIngredient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId });
    if (!ingredient) {
      res.status(404).json({ success: false, message: 'Ingredient not found' });
      return;
    }

    await ingredient.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const stockUpdateSchema = z.object({
  action: z.enum(['add', 'remove']),
  quantity: z.number().positive(),
});

export const updateStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsedData = stockUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const { action, quantity } = parsedData.data;

    const ingredient = await Ingredient.findOne({ _id: req.params.id, restaurantId: req.user?.restaurantId });
    if (!ingredient) {
      res.status(404).json({ success: false, message: 'Ingredient not found' });
      return;
    }

    if (action === 'remove' && ingredient.quantity < quantity) {
      res.status(400).json({ success: false, message: 'Cannot reduce stock below zero' });
      return;
    }

    const newQuantity = action === 'add' ? ingredient.quantity + quantity : ingredient.quantity - quantity;
    
    ingredient.quantity = newQuantity;
    await ingredient.save();

    if (req.user) {
      await logActivity(
        req.user._id, 
        req.user.restaurantId?.toString() || '', 
        action === 'add' ? 'UPDATED_STOCK' : 'REMOVED_STOCK', 
        'Ingredient', 
        ingredient._id.toString(), 
        { name: ingredient.name, change: action === 'add' ? quantity : -quantity }
      );
    }

    res.status(200).json({ success: true, data: ingredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
