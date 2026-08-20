import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { Users } from './pages/Users';
import { Inventory } from './pages/Inventory';
import { Waste } from './pages/Waste';
import { Purchases } from './pages/Purchases';
import { Analytics } from './pages/Analytics';
import { Recommendations } from './pages/Recommendations';
import { Login } from './pages/Login';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { ExperimentProvider } from './context/ExperimentContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ToastProvider>
      <ExperimentProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="waste" element={<Waste />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="recommendations" element={<Recommendations />} />
              </Route>
            </Route>

            {/* MANAGER ROUTES */}
            <Route path="/manager" element={<RoleProtectedRoute allowedRoles={['RESTAURANT_MANAGER']} />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<ManagerDashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="waste" element={<Waste />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="recommendations" element={<Recommendations />} />
              </Route>
            </Route>

            {/* STAFF ROUTES */}
            <Route path="/staff" element={<RoleProtectedRoute allowedRoles={['STAFF']} />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<StaffDashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="waste" element={<Waste />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ExperimentProvider>
    </ToastProvider>
  );
}

export default App;
