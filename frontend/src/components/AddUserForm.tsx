import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Alert } from './ui/Alert';
import api from '../services/api';

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/users', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add user');
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
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
      />
      
      <Input
        label="Temporary Password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        minLength={6}
      />

      <Select
        label="Role"
        name="role"
        required
        options={[
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Manager', value: 'RESTAURANT_MANAGER' },
          { label: 'Staff', value: 'STAFF' },
        ]}
        value={formData.role}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Create User
        </Button>
      </div>
    </form>
  );
};
