import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { RecordWasteForm } from '../components/RecordWasteForm';

export function Waste() {
  const [wasteRecords, setWasteRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWasteRecords = () => {
    setLoading(true);
    api.get('/waste')
      .then((res) => setWasteRecords(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWasteRecords();
  }, []);

  const getReasonBadge = (reason: string) => {
    switch(reason) {
      case 'EXPIRED': return <Badge variant="error">Expired</Badge>;
      case 'SPOILED': return <Badge variant="warning">Spoiled</Badge>;
      default: return <Badge variant="info">{reason}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Waste Log</h2>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Record Waste
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading waste records...</div>
          ) : wasteRecords.length === 0 ? (
            <EmptyState
              icon={Trash2}
              title="No waste recorded"
              description="No waste records found for this period."
              className="border-0 rounded-none"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Lost Cost</TableHead>
                  <TableHead>Recorded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wasteRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">
                      {record.ingredientId?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {record.quantity} {record.ingredientId?.unit}
                    </TableCell>
                    <TableCell>{getReasonBadge(record.reason)}</TableCell>
                    <TableCell className="text-red-600 font-medium">
                      ₹{record.cost.toFixed(2)}
                    </TableCell>
                    <TableCell>{record.userId?.name || 'System'}</TableCell>
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
        title="Record Waste"
      >
        <RecordWasteForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchWasteRecords();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
