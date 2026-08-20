import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Alert } from './ui/Alert';
import api from '../services/api';

interface RecordPurchaseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const RecordPurchaseForm: React.FC<RecordPurchaseFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    ingredientName: '',
    categoryId: '',
    quantity: 0,
    unit: 'kg',
    unitPrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/purchases', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <Input
        label="Ingredient Name"
        name="ingredientName"
        required
        value={formData.ingredientName}
        onChange={handleChange}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Category"
          name="categoryId"
          required
          value={formData.categoryId}
          onChange={handleChange}
        />
        <Select
          label="Unit"
          name="unit"
          options={[
            { label: 'kg', value: 'kg' },
            { label: 'g', value: 'g' },
            { label: 'liters', value: 'liters' },
            { label: 'ml', value: 'ml' },
            { label: 'pieces', value: 'pieces' },
          ]}
          value={formData.unit}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={formData.quantity}
          onChange={handleChange}
        />
        <Input
          label="Unit Price (₹)"
          name="unitPrice"
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.unitPrice}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Purchase Date"
          name="purchaseDate"
          type="date"
          required
          value={formData.purchaseDate}
          onChange={handleChange}
        />
        <Input
          label="Expiry Date"
          name="expiryDate"
          type="date"
          required
          value={formData.expiryDate}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Record Purchase
        </Button>
      </div>
    </form>
  );
};
