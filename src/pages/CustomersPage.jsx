import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { Plus, Edit2, Trash2, Search, Mail, Phone, CheckCircle, Clock, AlertCircle } from "lucide-react";

const SAMPLE_CUSTOMERS = [
  { id: "c1", name: "Ravi Kumar", email: "ravi@email.com", phone: "+91 98765 43210", spent: "₹25,000", joined: "2024-01-15", billStatus: "Paid", totalBills: "₹25,000", pendingAmount: "₹0" },
  { id: "c2", name: "Priya Singh", email: "priya@email.com", phone: "+91 98765 43211", spent: "₹18,500", joined: "2024-02-20", billStatus: "Pending", totalBills: "₹18,500", pendingAmount: "₹8,500" },
  { id: "c3", name: "Amit Patel", email: "amit@email.com", phone: "+91 98765 43212", spent: "₹32,100", joined: "2024-01-10", billStatus: "Paid", totalBills: "₹32,100", pendingAmount: "₹0" },
  { id: "c4", name: "Neha Gupta", email: "neha@email.com", phone: "+91 98765 43213", spent: "₹12,750", joined: "2024-03-05", billStatus: "Due", totalBills: "₹12,750", pendingAmount: "₹12,750" },
  { id: "c5", name: "Rajesh Sharma", email: "rajesh@email.com", phone: "+91 98765 43214", spent: "₹45,200", joined: "2023-12-01", billStatus: "Paid", totalBills: "₹45,200", pendingAmount: "₹0" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : SAMPLE_CUSTOMERS;
  });
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    spent: "₹0",
    joined: new Date().toISOString().split("T")[0],
    billStatus: "Pending",
    totalBills: "₹0",
    pendingAmount: "₹0",
  });

  // Show notification for a few seconds
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Save customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  function getStatusBadge(status) {
    switch (status) {
      case "Paid":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
          label: "Paid",
        };
      case "Pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: Clock,
          label: "Pending",
        };
      case "Due":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: AlertCircle,
          label: "Due",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: Clock,
          label: "Unknown",
        };
    }
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function saveCustomer(updated) {
    setCustomers((c) => c.map((it) => (it.id === updated.id ? updated : it)));
    setEditing(null);
  }

  function deleteCustomer(id) {
    const customer = customers.find(c => c.id === id);
    setDeleteConfirm({ id, name: customer?.name });
  }

  function confirmDelete(id) {
    const customerName = customers.find(c => c.id === id)?.name;
    setCustomers((c) => c.filter((it) => it.id !== id));
    setDeleteConfirm(null);
    showNotification(`Customer "${customerName}" deleted successfully!`, "delete");
  }

  function addNewCustomer() {
    if (newCustomer.name.trim() && newCustomer.email.trim() && newCustomer.phone.trim()) {
      const customer = {
        id: `c${Date.now()}`,
        name: newCustomer.name.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone.trim(),
        spent: newCustomer.spent,
        joined: newCustomer.joined,
        billStatus: newCustomer.billStatus,
        totalBills: newCustomer.totalBills,
        pendingAmount: newCustomer.pendingAmount,
      };
      setCustomers([...customers, customer]);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        spent: "₹0",
        joined: new Date().toISOString().split("T")[0],
        billStatus: "Pending",
        totalBills: "₹0",
        pendingAmount: "₹0",
      });
      setShowAddModal(false);
      showNotification(`✅ Customer "${customer.name}" added successfully!`, "success");
    } else {
      showNotification("⚠️ Please fill in all required fields (Name, Email, Phone)", "error");
    }
  }

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-2">Manage your customer relationships</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative"
      >
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((customer, idx) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl p-6 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{customer.joined}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {(() => {
                  const statusInfo = getStatusBadge(customer.billStatus);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </motion.div>
                  );
                })()}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(customer)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <p className="text-sm text-gray-700">{customer.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <p className="text-sm text-gray-700">{customer.phone}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div>
                <p className="text-xs text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-primary mt-1">{customer.spent}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-600">Total Bills</p>
                  <p className="font-bold text-gray-900 mt-1">{customer.totalBills}</p>
                </div>
                <div className={`p-2 rounded-lg ${customer.pendingAmount === "₹0" ? "bg-green-50" : "bg-red-50"}`}>
                  <p className={`${customer.pendingAmount === "₹0" ? "text-green-600" : "text-red-600"}`}>Pending</p>
                  <p className={`font-bold mt-1 ${customer.pendingAmount === "₹0" ? "text-green-900" : "text-red-900"}`}>
                    {customer.pendingAmount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditing(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Customer</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bill Status</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editing.billStatus}
                  onChange={(e) => setEditing({ ...editing, billStatus: e.target.value })}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Due">Due</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Bills</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editing.totalBills}
                  onChange={(e) => setEditing({ ...editing, totalBills: e.target.value })}
                  placeholder="e.g., ₹25,000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pending Amount</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editing.pendingAmount}
                  onChange={(e) => setEditing({ ...editing, pendingAmount: e.target.value })}
                  placeholder="e.g., ₹5,000"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => saveCustomer(editing)}
                className="flex-1 py-3 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-lg transition-shadow"
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl max-h-96 overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Customer</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Customer Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="e.g., ABC Restaurant"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="e.g., customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="e.g., +91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bill Status</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomer.billStatus}
                  onChange={(e) => setNewCustomer({ ...newCustomer, billStatus: e.target.value })}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Due">Due</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Bills</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomer.totalBills}
                  onChange={(e) => setNewCustomer({ ...newCustomer, totalBills: e.target.value })}
                  placeholder="e.g., ₹25,000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pending Amount</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomer.pendingAmount}
                  onChange={(e) => setNewCustomer({ ...newCustomer, pendingAmount: e.target.value })}
                  placeholder="e.g., ₹5,000"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addNewCustomer}
                className="flex-1 py-3 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-lg transition-shadow"
              >
                Add Customer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Customer?</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-bold">{deleteConfirm.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => confirmDelete(deleteConfirm.id)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
              >
                Yes, Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Notification Toast */}
      {notification && notification.type === "success" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-sm w-full mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={1.5} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Customer Added
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg"
            >
              Successfully added new customer to your database
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Success Notification */}
      {notification && notification.type === "delete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-sm w-full mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
            >
              <Trash2 className="w-16 h-16 text-red-600" strokeWidth={1.5} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Deleted Successfully
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg"
            >
              Customer has been removed from your database
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* Error Notification Toast */}
      {notification && notification.type === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg text-white font-bold flex items-center gap-3 z-50 bg-red-500"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            ⚠️
          </div>
          {notification.message}
        </motion.div>
      )}
    </div>
  );
}
