import { analyzeExpiryAndRisk } from '../intelligenceService';
import Ingredient from '../../models/Ingredient';

jest.mock('../../models/Ingredient');

describe('intelligenceService', () => {
  describe('analyzeExpiryAndRisk', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should classify ingredient as EXPIRED if expiry date is in the past', async () => {
      const mockIngredient = {
        _id: '1',
        name: 'Milk',
        quantity: 10,
        unit: 'L',
        purchasePrice: 2,
        expiryDate: new Date(Date.now() - 86400000), // 1 day ago
      };

      (Ingredient.find as jest.Mock).mockResolvedValue([mockIngredient]);

      const result = await analyzeExpiryAndRisk('rest-1');

      expect(result).toHaveLength(1);
      expect(result[0].riskLevel).toBe('EXPIRED');
      expect(result[0].estimatedCostAtRisk).toBe(20); // 10 * 2
    });

    it('should classify ingredient as SAFE if expiry date is far in the future', async () => {
      const mockIngredient = {
        _id: '1',
        name: 'Rice',
        quantity: 50,
        unit: 'kg',
        purchasePrice: 1,
        averageDailyUsage: 0,
        expiryDate: new Date(Date.now() + 30 * 86400000), // 30 days
      };

      (Ingredient.find as jest.Mock).mockResolvedValue([mockIngredient]);

      const result = await analyzeExpiryAndRisk('rest-1');

      expect(result).toHaveLength(1);
      expect(result[0].riskLevel).toBe('SAFE');
      expect(result[0].estimatedCostAtRisk).toBe(0);
    });
  });
});
