import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-light via-blue-50 to-light">
        <Navbar />
        <main className="md:ml-72 w-full md:pt-0 pt-16 transition-all duration-300 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pos-billing" element={<POSBillingPage />} />
            <Route path="/pos" element={<POSBillingPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/sellers" element={<SellerReportsPage />} />
            <Route path="/reports/stock" element={<StockReportsPage />} />
            <Route path="/reports/transit" element={<TransitReportsPage />} />
            <Route path="/reports/tax" element={<TaxReportsPage />} />
            <Route path="/settings" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
