import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, TrendingUp, DollarSign, ShoppingCart, Users, Zap, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { useExportSuccess } from "../context/ExportSuccessContext";

const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const salesData = [
  { month: "Jan", sales: 45000, revenue: 52000, orders: 120 },
  { month: "Feb", sales: 52000, revenue: 61000, orders: 145 },
  { month: "Mar", sales: 48000, revenue: 56000, orders: 130 },
  { month: "Apr", sales: 61000, revenue: 72000, orders: 165 },
  { month: "May", sales: 55000, revenue: 65000, orders: 150 },
  { month: "Jun", sales: 72000, revenue: 85000, orders: 190 },
];

const categoryData = [
  { name: "Food", value: 45, revenue: 245000 },
  { name: "Beverages", value: 25, revenue: 135000 },
  { name: "Desserts", value: 20, revenue: 108000 },
  { name: "Snacks", value: 10, revenue: 54000 },
];

const topProducts = [
  { id: 1, name: "Paneer Butter Masala", units: 542, revenue: 151760, growth: "+12%" },
  { id: 2, name: "Chicken Tikka Masala", units: 328, revenue: 104960, growth: "+18%" },
  { id: 3, name: "Biryani - Chicken", units: 215, revenue: 75250, growth: "+20%" },
  { id: 4, name: "Dal Tadka", units: 189, revenue: 28350, growth: "+5%" },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("month");
  const [chartType, setChartType] = useState("line");
  const exportSuccess = useExportSuccess();

  const reports = [
    { id: 1, title: "Total Revenue", icon: DollarSign, color: "bg-gradient-primary", value: "₹4,56,72,200", change: "+18%", trend: "up" },
    { id: 2, title: "Total Orders", icon: ShoppingCart, color: "bg-secondary", value: "1,200", change: "+24%", trend: "up" },
    { id: 3, title: "Total Customers", icon: Users, color: "bg-accent", value: "542", change: "+12%", trend: "up" },
    { id: 4, title: "Avg Order Value", icon: Target, color: "bg-purple-500", value: "₹3,807", change: "+8%", trend: "up" },
  ];

  const quickStats = [
    { label: "Conversion Rate", value: "24.5%", color: "text-green-600", bg: "bg-green-50" },
    { label: "Customer Retention", value: "78%", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Growth Rate", value: "12.5%", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Market Share", value: "32%", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  // Export Reports to Excel
  function handleExportReports() {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Sales Data sheet
      const salesSheet = XLSX.utils.json_to_sheet(salesData);
      XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales Data");
      
      // Category Data sheet
      const categorySheet = XLSX.utils.json_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(workbook, categorySheet, "Category Data");
      
      // Top Products sheet
      const productsSheet = XLSX.utils.json_to_sheet(topProducts);
      XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");
      
      // Reports Summary
      const reportsSummary = reports.map(r => ({
        Title: r.title,
        Value: r.value,
        Change: r.change,
        Trend: r.trend
      }));
      const summarySheet = XLSX.utils.json_to_sheet(reportsSummary);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Reports Summary");
      
      XLSX.writeFile(workbook, `reports_${new Date().toISOString().split('T')[0]}.xlsx`);
      try { exportSuccess.showExportSuccess("Reports exported successfully"); } catch (e) {}
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive business analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportReports}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="p-6 rounded-lg bg-white border border-gray-200 hover:border-green-500 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{report.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{report.value}</h3>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-lg ${report.color} shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-sm font-bold text-green-600">{report.change} from last month</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales & Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-lg bg-white border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Sales & Revenue Trend</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setChartType("line")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  chartType === "line"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Line
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  chartType === "bar"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Bar
              </motion.button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {chartType === "line" ? (
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  cursor={{ stroke: "#10B981", strokeWidth: 2 }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Sales (₹)"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Revenue (₹)"
                />
              </LineChart>
            ) : (
              <BarChart data={salesData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#10B981" name="Sales (₹)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Mix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Stats & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
            className={`p-6 rounded-lg border border-gray-200 ${stat.bg}`}
          >
            <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
            <p className={`${stat.color} text-3xl font-bold`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Product Name</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Units Sold</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Revenue</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, idx) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{product.units}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600">₹{product.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      {product.growth}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
