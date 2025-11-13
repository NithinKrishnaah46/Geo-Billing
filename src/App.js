import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import POSBillingPage from "./pages/POSBillingPage";
import InventoryPage from "./pages/InventoryPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import SellerReportsPage from "./pages/SellerReportsPage";
import StockReportsPage from "./pages/StockReportsPage";
import TransitReportsPage from "./pages/TransitReportsPage";
import TaxReportsPage from "./pages/TaxReportsPage";
import ProfileSettings from "./pages/ProfileSettings";

// Protected Route Component
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isLoggedIn = !!user;

  return (
    <BrowserRouter>
      <NotificationProvider>
        {isLoggedIn ? (
          // Main App Layout (Only shown when logged in)
          <div className="flex min-h-screen bg-gradient-to-br from-light via-blue-50 to-light">
            <Navbar />
            <main className="md:ml-72 w-full md:pt-0 pt-16 transition-all duration-300 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/pos-billing" element={<ProtectedRoute><POSBillingPage /></ProtectedRoute>} />
                <Route path="/pos" element={<ProtectedRoute><POSBillingPage /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/reports/sellers" element={<ProtectedRoute><SellerReportsPage /></ProtectedRoute>} />
                <Route path="/reports/stock" element={<ProtectedRoute><StockReportsPage /></ProtectedRoute>} />
                <Route path="/reports/transit" element={<ProtectedRoute><TransitReportsPage /></ProtectedRoute>} />
                <Route path="/reports/tax" element={<ProtectedRoute><TaxReportsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/login" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        ) : (
          // Login Page (Only shown when not logged in)
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </NotificationProvider>
    </BrowserRouter>
  );
}
