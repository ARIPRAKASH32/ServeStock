import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Plus, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { RecordPurchaseForm } from '../components/RecordPurchaseForm';

export function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPurchases = () => {
    setLoading(true);
    api.get('/purchases')
      .then((res) => setPurchases(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Record Purchase
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading purchases...</div>
          ) : purchases.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="No purchases recorded"
              description="Record your first purchase to track incoming inventory."
              className="border-0 rounded-none"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell>{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{purchase.ingredientName}</TableCell>
                    <TableCell>{purchase.quantity} {purchase.unit}</TableCell>
                    <TableCell>₹{purchase.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      ₹{purchase.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(purchase.expiryDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Purchase"
      >
        <RecordPurchaseForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPurchases();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
