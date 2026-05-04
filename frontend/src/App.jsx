import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import DiseaseDetection from './pages/DiseaseDetection';
import Marketplace from './pages/Marketplace';
import CropAdvisory from './pages/CropAdvisory';
import FarmManagement from './pages/FarmManagement';

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<Chatbot />} />
        <Route path="disease" element={<DiseaseDetection />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="advisory" element={<CropAdvisory />} />
        <Route path="farm" element={<FarmManagement />} />
        <Route path="admin" element={<div className="p-8 text-center text-slate-500">Admin dashboard coming soon.</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
