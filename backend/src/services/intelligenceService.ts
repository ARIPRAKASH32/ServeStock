import mongoose from 'mongoose';
import Ingredient, { IIngredient } from '../models/Ingredient';
import Purchase from '../models/Purchase';
import WasteRecord from '../models/WasteRecord';

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'EXPIRED';

export interface ExpiryAnalysis {
  ingredient: IIngredient;
  daysRemaining: number;
  expectedUsage: number;
  potentialExcess: number;
  riskLevel: RiskLevel;
  estimatedCostAtRisk: number;
  recommendedAction: string;
}

export const analyzeExpiryAndRisk = async (restaurantId: string): Promise<ExpiryAnalysis[]> => {
  const ingredients = await Ingredient.find({ restaurantId });
  const today = new Date();
  const analysisList: ExpiryAnalysis[] = [];

  for (const ingredient of ingredients) {
    const timeDiff = ingredient.expiryDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Simulate expected usage based on averageDailyUsage.
    // If averageDailyUsage is 0, we can fall back to a small default or keep it 0.
    const expectedUsage = ingredient.averageDailyUsage * Math.max(0, daysRemaining);
    const potentialExcess = Math.max(0, ingredient.quantity - expectedUsage);
    
    let riskLevel: RiskLevel = 'SAFE';
    let action = 'Stock levels and usage are normal.';

    if (daysRemaining <= 0) {
      riskLevel = 'EXPIRED';
      action = 'Ingredient has expired. Remove from inventory and record waste.';
    } else if (daysRemaining <= 2) {
      if (potentialExcess > 0) {
        riskLevel = 'CRITICAL';
        action = `Expires in ${daysRemaining} days and ${potentialExcess.toFixed(2)} ${ingredient.unit} may remain unused. Prioritize immediate usage and consider reducing the next purchase quantity.`;
      } else {
        riskLevel = 'WARNING'; // Close to expiry but likely to be used
        action = `Expires in ${daysRemaining} days. Expected usage covers remaining stock. Monitor closely.`;
      }
    } else if (daysRemaining <= 7) {
      if (potentialExcess > ingredient.quantity * 0.5) {
        riskLevel = 'HIGH';
        action = `${potentialExcess.toFixed(2)} ${ingredient.unit} may remain unused before expiry. Consider incorporating into daily specials.`;
      } else {
        riskLevel = 'LOW';
        action = `Approaching expiry in ${daysRemaining} days.`;
      }
    }

    // Cost at risk is based on potential excess that will expire
    const estimatedCostAtRisk = riskLevel === 'EXPIRED' ? 
      (ingredient.quantity * ingredient.purchasePrice) : 
      (potentialExcess * ingredient.purchasePrice);

    analysisList.push({
      ingredient,
      daysRemaining,
      expectedUsage,
      potentialExcess,
      riskLevel: riskLevel as RiskLevel,
      estimatedCostAtRisk,
      recommendedAction: action
    });
  }

  return analysisList.sort((a, b) => a.daysRemaining - b.daysRemaining);
};

export const generatePurchaseFeedback = async (restaurantId: string) => {
  // 1. Get recent waste (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const wasteAgg = await WasteRecord.aggregate([
    { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), date: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$ingredientId', totalWasted: { $sum: '$quantity' }, wasteCost: { $sum: '$cost' } } }
  ]);

  const feedback = [];
  
  for (const waste of wasteAgg) {
    if (waste.totalWasted > 0) {
      const ingredient = await Ingredient.findById(waste._id);
      if (ingredient) {
        // High waste relative to current stock or just absolute high waste cost
        if (waste.wasteCost > 1000 || waste.totalWasted > ingredient.quantity * 0.2) {
          feedback.push({
            type: 'PURCHASE_ADJUSTMENT',
            priority: 'HIGH',
            title: `High waste detected for ${ingredient.name}`,
            problem: `${ingredient.name} has had ${waste.totalWasted} ${ingredient.unit} wasted in the last 30 days, costing approx ${waste.wasteCost}.`,
            evidence: `Historical waste cost: ${waste.wasteCost}. Current stock: ${ingredient.quantity}.`,
            recommendedAction: `Consider reducing the next purchase quantity of ${ingredient.name} by at least 15-20% to prevent recurring waste.`
          });
        }
      }
    }
  }

  return feedback;
};
