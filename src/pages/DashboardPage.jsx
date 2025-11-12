import React from "react";
import { motion } from "framer-motion";
import { Users, ShoppingCart, DollarSign, ArrowUpRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <motion.div
    whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}
    whileTap={{ scale: 0.98 }}
    className={`p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden relative group`}
  >
    <div className={`absolute -right-8 -top-8 w-32 h-32 ${color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-4xl font-bold text-gray-900 mt-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{value}</h3>
        <div className="flex items-center gap-1 mt-3">
          <ArrowUpRight className={`w-4 h-4 font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          <span className={`text-sm font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
          </span>
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`p-4 rounded-xl ${color} shadow-lg`}
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleCreateInvoice = () => {
    navigate("/pos-billing");
  };

  const handleAddProduct = () => {
    navigate("/inventory");
  };

  const handleNewCustomer = () => {
    navigate("/customers");
  };

  const handleViewReports = () => {
    navigate("/reports");
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "₹12,45,890",
      change: 12,
      icon: DollarSign,
      color: "bg-gradient-primary",
    },
    {
      title: "Total Orders",
      value: "842",
      change: 8,
      icon: ShoppingCart,
      color: "bg-secondary",
    },
    {
      title: "Total Customers",
      value: "324",
      change: 15,
      icon: Users,
      color: "bg-accent",
    },
    {
      title: "Page Views",
      value: "42.3K",
      change: 5,
      icon: Eye,
      color: "bg-purple-500",
    },
  ];

  const recentOrders = [
    { id: "ORD001", customer: "Ravi Kumar", amount: "₹5,999", status: "Completed" },
    { id: "ORD002", customer: "Priya Singh", amount: "₹3,499", status: "Pending" },
    { id: "ORD003", customer: "Amit Patel", amount: "₹8,999", status: "Completed" },
    { id: "ORD004", customer: "Neha Gupta", amount: "₹2,499", status: "Processing" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-blue-50 to-light p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-gray-600 mt-3 text-lg">Welcome back! Here's your business overview</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
              <p className="text-gray-600 text-sm mt-1">Latest transactions</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="text-sm text-primary font-bold hover:text-primary/80 hover:bg-primary/5 px-4 py-2 rounded-lg transition-all"
            >
              View All →
            </motion.button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.02)" }}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent hover:border-primary/20 transition-all"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{order.customer}</p>
                  <p className="text-sm text-gray-600">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.amount}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              onClick={handleCreateInvoice}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-4 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-xl transition-all text-lg"
            >
              Create Invoice
            </motion.button>
            <motion.button
              onClick={handleAddProduct}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-4 rounded-xl bg-secondary text-white font-bold hover:shadow-xl transition-all text-lg"
            >
              Add Product
            </motion.button>
            <motion.button
              onClick={handleNewCustomer}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-4 rounded-xl bg-accent text-white font-bold hover:shadow-xl transition-all text-lg"
            >
              New Customer
            </motion.button>
            <motion.button
              onClick={handleViewReports}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-4 rounded-xl border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-primary transition-all text-lg"
            >
              View Reports
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

