/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess'; // Rename later or repurpose as onboarding
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Investigation from './pages/dashboard/Investigation';
import Anomalies from './pages/dashboard/Anomalies';
import Reports from './pages/dashboard/Reports';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<RequestAccess />} /> {/* Reusing this component as the 4 step setup */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/investigation" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="investigation" element={<Investigation />} />
            <Route path="anomalies" element={<Anomalies />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
