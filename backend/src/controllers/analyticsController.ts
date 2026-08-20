import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import WasteRecord from '../models/WasteRecord';
import Purchase from '../models/Purchase';
import Ingredient from '../models/Ingredient';
import mongoose from 'mongoose';

import User from '../models/User';
import ActivityLog from '../models/ActivityLog';

// Helper to get common stats
const getCommonDashboardStats = async (restaurantId: mongoose.Types.ObjectId) => {
  const inventory = await Ingredient.find({ restaurantId });
  const totalInventoryItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.minimumStockLevel).length;

  const today = new Date();
  let expiredItems = 0;
  let expiringSoon = 0;

  inventory.forEach(i => {
    const days = (i.expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    if (days <= 0) expiredItems++;
    else if (days <= 7) expiringSoon++;
  });

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const wasteAgg = await WasteRecord.aggregate([
    { $match: { restaurantId, date: { $gte: startOfMonth } } },
    { $group: { _id: null, totalWasteCost: { $sum: '$cost' } } }
  ]);
  const wasteCostThisMonth = wasteAgg.length > 0 ? wasteAgg[0].totalWasteCost : 0;

  const purchaseAgg = await Purchase.aggregate([
    { $match: { restaurantId, purchaseDate: { $gte: startOfMonth } } },
    { $group: { _id: null, totalPurchaseCost: { $sum: '$totalPrice' } } }
  ]);
  const purchaseCostThisMonth = purchaseAgg.length > 0 ? purchaseAgg[0].totalPurchaseCost : 0;

  return {
    totalInventoryItems,
    lowStockItems,
    expiredItems,
    expiringSoon,
    wasteCostThisMonth,
    purchaseCostThisMonth
  };
};

export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) return;
    const objId = new mongoose.Types.ObjectId(restaurantId as unknown as string);

    const stats = await getCommonDashboardStats(objId);
    
    // Admin specific: Users
    const users = await User.find({ restaurantId: objId });
    const totalUsers = users.length;
    const managers = users.filter(u => u.role === 'RESTAURANT_MANAGER').length;
    const staff = users.filter(u => u.role === 'STAFF').length;

    res.status(200).json({
      success: true,
      data: { ...stats, totalUsers, managers, staff }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getManagerDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) return;
    const objId = new mongoose.Types.ObjectId(restaurantId as unknown as string);

    const stats = await getCommonDashboardStats(objId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) return;
    const objId = new mongoose.Types.ObjectId(restaurantId as unknown as string);

    const inventory = await Ingredient.find({ restaurantId: objId });
    const totalInventoryItems = inventory.length;
    const lowStockItems = inventory.filter(i => i.quantity <= i.minimumStockLevel).length;

    const recentActivity = await ActivityLog.find({ restaurantId: objId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalInventoryItems,
        lowStockItems,
        recentActivity
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWasteAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId;
    const objId = new mongoose.Types.ObjectId(restaurantId as unknown as string);

    // Group by reason
    const wasteByReason = await WasteRecord.aggregate([
      { $match: { restaurantId: objId } },
      { $group: { _id: '$reason', cost: { $sum: '$cost' }, count: { $sum: 1 } } }
    ]);

    // Group by ingredient
    const wasteByIngredient = await WasteRecord.aggregate([
      { $match: { restaurantId: objId } },
      { $group: { _id: '$ingredientId', totalCost: { $sum: '$cost' }, totalQuantity: { $sum: '$quantity' } } },
      { $sort: { totalCost: -1 } },
      { $limit: 10 }
    ]);

    // Populate ingredient names
    await Ingredient.populate(wasteByIngredient, { path: '_id', select: 'name category' });

    res.status(200).json({
      success: true,
      data: {
        wasteByReason,
        wasteByIngredient
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
