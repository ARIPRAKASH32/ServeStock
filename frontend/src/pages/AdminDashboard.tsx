import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Package, AlertTriangle, Trash2, Users, Shield, DollarSign, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard/admin')
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-100 rounded-t-xl" />
            <CardContent className="h-16" />
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-600' },
    { title: 'Managers', value: stats?.managers || 0, icon: Shield, color: 'text-indigo-500' },
    { title: 'Total Inventory', value: stats?.totalInventoryItems || 0, icon: Package, color: 'text-blue-600' },
    { title: 'Low Stock', value: stats?.lowStockItems || 0, icon: AlertTriangle, color: 'text-yellow-600' },
    { title: 'Waste This Month', value: `₹${stats?.wasteCostThisMonth?.toFixed(2) || '0.00'}`, icon: Trash2, color: 'text-red-600' },
    { title: 'Purchase Cost', value: `₹${stats?.purchaseCostThisMonth?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-green-600' },
    { title: 'Expiring Soon', value: stats?.expiringSoon || 0, icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Expired Items', value: stats?.expiredItems || 0, icon: AlertTriangle, color: 'text-red-700' },
  ];

  // Placeholder chart data until we wire up trend analytics endpoint
  const mockChartData = [
    { name: 'Mon', waste: 400, purchases: 2400 },
    { name: 'Tue', waste: 300, purchases: 1398 },
    { name: 'Wed', waste: 200, purchases: 9800 },
    { name: 'Thu', waste: 278, purchases: 3908 },
    { name: 'Fri', waste: 189, purchases: 4800 },
    { name: 'Sat', waste: 239, purchases: 3800 },
    { name: 'Sun', waste: 349, purchases: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

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
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              Financial Trend (Mocked)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="purchases" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Purchases" />
                <Bar dataKey="waste" fill="#ef4444" radius={[4, 4, 0, 0]} name="Waste Cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
