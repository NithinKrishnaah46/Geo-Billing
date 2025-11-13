import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Package, Warehouse, Download } from "lucide-react";
import * as XLSX from "xlsx";

const stockDetails = [
  { id: 1, product: "Paneer Butter Masala", sku: "SKU-2024-001", warehouse: "Main Warehouse", currentStock: 245, minLevel: 50, maxLevel: 500, status: "In Stock", location: "Rack A-12", lastUpdated: "2 hours ago", turnoverRate: "18.2/month", unitPrice: 280, totalValue: 68600 },
  { id: 2, product: "Chicken Tikka Masala", sku: "SKU-2024-002", warehouse: "Main Warehouse", currentStock: 178, minLevel: 40, maxLevel: 400, status: "In Stock", location: "Rack B-08", lastUpdated: "45 min ago", turnoverRate: "14.8/month", unitPrice: 320, totalValue: 56960 },
  { id: 3, product: "Butter Naan", sku: "SKU-2024-005", warehouse: "Cold Storage", currentStock: 28, minLevel: 60, maxLevel: 300, status: "Low Stock", location: "Cold-02", lastUpdated: "12 hours ago", turnoverRate: "25.5/month", unitPrice: 120, totalValue: 3360 },
  { id: 4, product: "Dal Tadka", sku: "SKU-2024-004", warehouse: "Main Warehouse", currentStock: 156, minLevel: 35, maxLevel: 350, status: "In Stock", location: "Rack C-15", lastUpdated: "1 hour ago", turnoverRate: "13.6/month", unitPrice: 150, totalValue: 23400 },
  { id: 5, product: "Vegetable Biryani", sku: "SKU-2024-006", warehouse: "Main Warehouse", currentStock: 8, minLevel: 25, maxLevel: 200, status: "Critical", location: "Rack D-03", lastUpdated: "3 hours ago", turnoverRate: "16.2/month", unitPrice: 280, totalValue: 2240 },
  { id: 6, product: "Chicken Biryani", sku: "SKU-2024-007", warehouse: "Main Warehouse", currentStock: 92, minLevel: 30, maxLevel: 250, status: "In Stock", location: "Rack D-05", lastUpdated: "30 min ago", turnoverRate: "21.3/month", unitPrice: 350, totalValue: 32200 },
];

export default function StockReportsPage() {
  const [expandedStock, setExpandedStock] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("value");

  const filteredStock = stockDetails
    .filter((stock) => filterStatus === "all" || stock.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "value") return b.totalValue - a.totalValue;
      if (sortBy === "stock") return b.currentStock - a.currentStock;
      if (sortBy === "turnover") return parseFloat(b.turnoverRate) - parseFloat(a.turnoverRate);
      return 0;
    });

  const totalInventoryValue = stockDetails.reduce((acc, s) => acc + s.totalValue, 0);
  const lowStockCount = stockDetails.filter(s => s.status === "Low Stock" || s.status === "Critical").length;
  const totalUnits = stockDetails.reduce((acc, s) => acc + s.currentStock, 0);

  // Export Stock Report to Excel
  function handleExportStock() {
    try {
      const exportData = stockDetails.map(s => ({
        Product: s.product,
        SKU: s.sku,
        Warehouse: s.warehouse,
        "Current Stock": s.currentStock,
        "Min Level": s.minLevel,
        "Max Level": s.maxLevel,
        Status: s.status,
        Location: s.location,
        "Last Updated": s.lastUpdated,
        "Turnover Rate": s.turnoverRate,
        "Unit Price": s.unitPrice,
        "Total Value": s.totalValue
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");
      
      // Add summary sheet
      const summaryData = [{
        "Total Units in Stock": totalUnits,
        "Total Inventory Value": `₹${totalInventoryValue.toLocaleString()}`,
        "Low Stock Items": lowStockCount,
        "Date Exported": new Date().toLocaleDateString()
      }];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
      
      XLSX.writeFile(workbook, `stock_reports_${new Date().toISOString().split('T')[0]}.xlsx`);
      alert("✅ Warehouse & Stock reports exported successfully!");
    } catch (error) {
      alert("⚠️ Error exporting file: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">Warehouse & Stock Reports</h1>
        <p className="text-gray-600 mt-2">Real-time inventory tracking and warehouse management</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Units in Stock</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{totalUnits}</p>
            </div>
            <Package className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Inventory Value</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">₹{(totalInventoryValue / 100000).toFixed(2)}L</p>
            </div>
            <Warehouse className="w-10 h-10 text-blue-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{lowStockCount}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Turnover Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">18.3</p>
              <p className="text-xs text-gray-600 mt-1">units/month</p>
            </div>
            <TrendingDown className="w-10 h-10 text-orange-600 opacity-20" />
          </div>
        </motion.div>
      </motion.div>

      {/* Filters & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8 flex-wrap"
      >
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
          >
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
          >
            <option value="value">Sort by Value</option>
            <option value="stock">Sort by Stock</option>
            <option value="turnover">Sort by Turnover</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportStock}
          className="ml-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Stock Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Inventory Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Warehouse</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Min/Max</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Unit Price</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total Value</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStock.map((stock, idx) => {
                const statusColors = {
                  "In Stock": "bg-green-100 text-green-800",
                  "Low Stock": "bg-yellow-100 text-yellow-800",
                  "Critical": "bg-red-100 text-red-800",
                };
                return (
                  <motion.tr
                    key={stock.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + idx * 0.05 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedStock(expandedStock === stock.id ? null : stock.id)}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">{stock.product}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">{stock.sku}</td>
                    <td className="px-6 py-4 text-gray-700">{stock.warehouse}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{stock.currentStock}</td>
                    <td className="px-6 py-4 text-center text-gray-600 text-xs">{stock.minLevel}/{stock.maxLevel}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">₹{stock.unitPrice}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">₹{stock.totalValue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColors[stock.status]}`}>
                        {stock.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Warehouse Locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Main Warehouse</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Units</span>
              <span className="font-bold text-gray-900">671</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Warehouse Value</span>
              <span className="font-bold text-green-600">₹1,83,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Utilization</span>
              <span className="font-bold text-blue-600">67.1%</span>
            </div>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "67.1%" }}></div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Cold Storage</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Units</span>
              <span className="font-bold text-gray-900">28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Warehouse Value</span>
              <span className="font-bold text-green-600">₹3,360</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Utilization</span>
              <span className="font-bold text-orange-600">9.3%</span>
            </div>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: "9.3%" }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
