import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Package, AlertTriangle, Trash2, DollarSign } from 'lucide-react';
import api from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd handle errors and auth redirects
    api.get('/analytics/dashboard')
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-100 rounded-t-xl" />
            <CardContent className="h-16" />
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    { title: 'Total Inventory', value: stats?.totalInventoryItems || 0, icon: Package, color: 'text-blue-600' },
    { title: 'Low Stock', value: stats?.lowStockItems || 0, icon: AlertTriangle, color: 'text-yellow-600' },
    { title: 'Expiring Soon', value: stats?.expiringSoon || 0, icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Waste This Month', value: `₹${stats?.wasteCostThisMonth?.toFixed(2) || '0.00'}`, icon: Trash2, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts placeholder for later */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg m-6 mt-0">
            Chart Area
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Waste by Ingredient</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg m-6 mt-0">
            Chart Area
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
