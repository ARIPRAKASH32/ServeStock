import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Alert } from './ui/Alert';
import api from '../services/api';

interface AddIngredientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddIngredientForm: React.FC<AddIngredientFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    minimumStockLevel: 0,
    purchasePrice: 0,
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
      await api.post('/inventory', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add ingredient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <Input
        label="Name"
        name="name"
        required
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Tomato"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Vegetable"
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
          label="Current Stock"
          name="quantity"
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.quantity}
          onChange={handleChange}
        />
        <Input
          label="Minimum Stock"
          name="minimumStockLevel"
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.minimumStockLevel}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Purchase Price (Total)"
          name="purchasePrice"
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.purchasePrice}
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
          Add Ingredient
        </Button>
      </div>
    </form>
  );
};
