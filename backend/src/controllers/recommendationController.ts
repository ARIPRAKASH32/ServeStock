import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { analyzeExpiryAndRisk, generatePurchaseFeedback } from '../services/intelligenceService';

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = req.user?.restaurantId as unknown as string;
    if (!restaurantId) return;

    // 1. Get Expiry & Waste Risk Analysis
    const expiryAnalysis = await analyzeExpiryAndRisk(restaurantId);
    
    // Filter for actionable risk levels
    const actionableRisks = expiryAnalysis.filter(a => ['CRITICAL', 'HIGH', 'EXPIRED'].includes(a.riskLevel));

    const expiryRecommendations = actionableRisks.map(risk => ({
      type: risk.riskLevel === 'EXPIRED' ? 'EXPIRED_ACTION' : 'EXPIRY_RISK',
      priority: risk.riskLevel,
      title: `${risk.ingredient.name} Expiry Risk`,
      problem: `Approaching expiry with expected excess.`,
      evidence: `Expires in ${risk.daysRemaining} days. Expected usage: ${risk.expectedUsage.toFixed(1)}, Potential Excess: ${risk.potentialExcess.toFixed(1)} ${risk.ingredient.unit}.`,
      recommendedAction: risk.recommendedAction
    }));

    // 2. Get Purchase Feedback
    const purchaseFeedback = await generatePurchaseFeedback(restaurantId);

    res.status(200).json({
      success: true,
      data: [...expiryRecommendations, ...purchaseFeedback]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
