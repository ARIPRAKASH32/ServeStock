import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Alert } from './ui/Alert';
import api from '../services/api';

interface StockUpdateFormProps {
  ingredientId: string;
  ingredientName: string;
  currentStock: number;
  unit: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const StockUpdateForm: React.FC<StockUpdateFormProps> = ({ 
  ingredientId, 
  ingredientName, 
  currentStock,
  unit,
  onSuccess, 
  onCancel 
}) => {
  const [action, setAction] = useState<'add' | 'remove'>('add');
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const newStock = action === 'add' 
    ? currentStock + (quantity || 0)
    : currentStock - (quantity || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (quantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }
    
    if (action === 'remove' && quantity > currentStock) {
      setError('Cannot remove more than current stock.');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/inventory/${ingredientId}/stock`, {
        action,
        quantity
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-500">Ingredient</p>
        <p className="font-medium text-gray-900">{ingredientName}</p>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-500">Current Stock</p>
          <p className="font-semibold text-brand-600">{currentStock} {unit}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Action"
          name="action"
          options={[
            { label: 'Add Stock', value: 'add' },
            { label: 'Remove Stock', value: 'remove' },
          ]}
          value={action}
          onChange={(e) => setAction(e.target.value as 'add' | 'remove')}
        />
        <Input
          label={`Quantity (${unit})`}
          name="quantity"
          type="number"
          min="0"
          step="0.01"
          required
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex justify-between mt-2">
        <span>Resulting Stock:</span>
        <span className="font-bold">{newStock} {unit}</span>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Update Stock
        </Button>
      </div>
    </form>
  );
};
