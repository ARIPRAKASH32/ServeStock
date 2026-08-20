import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Package, AlertTriangle, Activity, Clock } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export function StaffDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analytics/dashboard/staff')
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  const kpis = [
    { title: 'Available Inventory', value: data?.totalInventoryItems || 0, icon: Package, color: 'text-blue-600' },
    { title: 'Low Stock Alerts', value: data?.lowStockItems || 0, icon: AlertTriangle, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button 
              onClick={() => navigate('inventory')}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center gap-3"
            >
              <div className="bg-indigo-100 p-2 rounded-md"><Package className="h-5 w-5 text-indigo-600"/></div>
              <div>
                <div className="font-medium text-gray-900">Update Stock</div>
                <div className="text-sm text-gray-500">Record new deliveries or stock usage</div>
              </div>
            </button>
            <button 
              onClick={() => navigate('waste')}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <div className="bg-red-100 p-2 rounded-md"><AlertTriangle className="h-5 w-5 text-red-600"/></div>
              <div>
                <div className="font-medium text-gray-900">Record Waste</div>
                <div className="text-sm text-gray-500">Log spoiled or expired ingredients</div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.map((log: any) => (
                  <div key={log._id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">{log.user?.name || 'Unknown user'}</span>
                      {' '}<span className="text-gray-600">{log.action.replace(/_/g, ' ').toLowerCase()}</span>
                      {' '}on <span className="font-medium text-gray-900">{log.entity}</span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">No recent activity found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
