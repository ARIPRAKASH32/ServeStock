import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PackagePlus, Search } from 'lucide-react';
import api from '../services/api';
import { EmptyState } from '../components/ui/EmptyState';
import { Package } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { AddIngredientForm } from '../components/AddIngredientForm';
import { StockUpdateForm } from '../components/StockUpdateForm';

export function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockUpdateItem, setStockUpdateItem] = useState<any | null>(null);

  const fetchInventory = () => {
    setLoading(true);
    api.get('/inventory')
      .then((res) => {
        setInventory(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStockBadge = (current: number, min: number) => {
    if (current === 0) return <Badge variant="error">Out of Stock</Badge>;
    if (current <= min) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">Healthy</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <PackagePlus className="w-4 h-4" />
          Add Ingredient
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search ingredients..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory...</div>
          ) : inventory.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No ingredients found"
              description="Your inventory is currently empty. Add some ingredients to get started."
              className="border-0 rounded-none"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      {item.minimumStockLevel} {item.unit}
                    </TableCell>
                    <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStockBadge(item.quantity, item.minimumStockLevel)}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setStockUpdateItem(item)}>Update Stock</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Ingredient"
      >
        <AddIngredientForm 
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchInventory();
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {stockUpdateItem && (
        <Modal
          isOpen={!!stockUpdateItem}
          onClose={() => setStockUpdateItem(null)}
          title="Quick Stock Update"
        >
          <StockUpdateForm
            ingredientId={stockUpdateItem._id}
            ingredientName={stockUpdateItem.name}
            currentStock={stockUpdateItem.quantity}
            unit={stockUpdateItem.unit}
            onSuccess={() => {
              setStockUpdateItem(null);
              fetchInventory();
            }}
            onCancel={() => setStockUpdateItem(null)}
          />
        </Modal>
      )}
    </div>
  );
}
