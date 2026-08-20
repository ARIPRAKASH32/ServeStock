import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Alert } from './ui/Alert';
import api from '../services/api';

interface RecordWasteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const RecordWasteForm: React.FC<RecordWasteFormProps> = ({ onSuccess, onCancel }) => {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    ingredientId: '',
    quantity: 0,
    reason: 'SPOILED',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/inventory').then((res) => setIngredients(res.data.data));
  }, []);

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
    
    if (!formData.ingredientId) {
      setError('Please select an ingredient.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/waste', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record waste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <Select
        label="Ingredient"
        name="ingredientId"
        required
        options={[
          { label: 'Select an ingredient...', value: '' },
          ...ingredients.map(ing => ({ label: `${ing.name} (${ing.unit})`, value: ing._id }))
        ]}
        value={formData.ingredientId}
        onChange={handleChange}
      />
      
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

      <Select
        label="Reason"
        name="reason"
        required
        options={[
          { label: 'Expired', value: 'EXPIRED' },
          { label: 'Spoiled', value: 'SPOILED' },
          { label: 'Overproduction', value: 'OVERPRODUCTION' },
          { label: 'Damaged', value: 'DAMAGED' },
          { label: 'Preparation Waste', value: 'PREPARATION_WASTE' },
          { label: 'Customer Return', value: 'CUSTOMER_RETURN' },
          { label: 'Other', value: 'OTHER' },
        ]}
        value={formData.reason}
        onChange={handleChange}
      />

      <Input
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Optional context..."
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Record Waste
        </Button>
      </div>
    </form>
  );
};
