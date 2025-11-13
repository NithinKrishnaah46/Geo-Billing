import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Search, Download, Upload, Package, AlertTriangle, DollarSign } from "lucide-react";
import * as XLSX from "xlsx";

const SAMPLE_PRODUCTS = [
  { id: "p1", name: "Paneer Butter Masala", category: "Main Course", sku: "CUR-PBM", barcode: "8903001000001", stock: 999, purchasePrice: 120, sellingPrice: 280, tax: 5, status: "In Stock" },
  { id: "p2", name: "Chicken Tikka Masala", category: "Main Course", sku: "CUR-CTM", barcode: "8903001000002", stock: 999, purchasePrice: 140, sellingPrice: 320, tax: 5, status: "In Stock" },
  { id: "p3", name: "Dal Tadka", category: "Main Course", sku: "CUR-DLT", barcode: "8903001000003", stock: 999, purchasePrice: 60, sellingPrice: 150, tax: 5, status: "In Stock" },
  { id: "p4", name: "Biryani - Veg", category: "Main Course", sku: "BIR-VEG", barcode: "8903001000004", stock: 450, purchasePrice: 100, sellingPrice: 200, tax: 5, status: "In Stock" },
  { id: "p5", name: "Biryani - Chicken", category: "Main Course", sku: "BIR-CHK", barcode: "8903001000005", stock: 120, purchasePrice: 150, sellingPrice: 350, tax: 5, status: "In Stock" },
  { id: "p6", name: "Butter Naan", category: "Bread", sku: "BRD-BUN", barcode: "8903001000006", stock: 50, purchasePrice: 20, sellingPrice: 60, tax: 5, status: "Low Stock" },
];

export default function InventoryPage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "All Status" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["All Categories", ...new Set(products.map(p => p.category))];
  const statuses = ["All Status", "In Stock", "Low Stock", "Out of Stock"];

  function saveProduct(updated) {
    setProducts((p) => p.map((it) => (it.id === updated.id ? updated : it)));
    setEditing(null);
  }

  function deleteProduct(id) {
    setProducts((p) => p.filter((it) => it.id !== id));
  }

  // Export Products to Excel
  function handleExportProducts() {
    try {
      const worksheet = XLSX.utils.json_to_sheet(products);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
      XLSX.writeFile(workbook, `inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
      alert("✅ Inventory exported successfully!");
    } catch (error) {
      alert("⚠️ Error exporting file: " + error.message);
    }
  }

  // Import Products from Excel
  function handleImportProducts(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const newProducts = jsonData.map((item, idx) => ({
          id: `p_${Date.now()}_${idx}`,
          name: item.name || "Unnamed",
          category: item.category || "General",
          sku: item.sku || `SKU-${idx}`,
          barcode: item.barcode || `BAR-${idx}`,
          stock: parseInt(item.stock) || 0,
          purchasePrice: parseFloat(item.purchasePrice) || 0,
          sellingPrice: parseFloat(item.sellingPrice) || 0,
          tax: parseFloat(item.tax) || 0,
          status: item.stock > 100 ? "In Stock" : item.stock > 0 ? "Low Stock" : "Out of Stock"
        }));
        
        setProducts([...products, ...newProducts]);
        alert(`✅ ${newProducts.length} products imported successfully!`);
      } catch (error) {
        alert("⚠️ Error importing file: " + error.message);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  }

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockAlerts = products.filter(p => p.stock < 100).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-2">Spice Garden Restaurant - Track stock levels and product information</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportProducts}
              className="px-6 py-3 flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-900 rounded-lg font-bold hover:border-green-500 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </motion.button>
            <label className="px-6 py-3 flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-900 rounded-lg font-bold hover:border-green-500 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Import Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportProducts}
                className="hidden"
              />
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[
          { title: "Total Products", value: totalProducts, subtitle: "Active inventory items", icon: Package, color: "bg-blue-50", textColor: "text-blue-600" },
          { title: "Low Stock Alerts", value: lowStockAlerts, subtitle: "Items need restocking", icon: AlertTriangle, color: "bg-red-50", textColor: "text-red-600" },
          { title: "Total Inventory Value", value: `₹${totalInventoryValue.toLocaleString()}`, subtitle: "Current stock value", icon: DollarSign, color: "bg-green-50", textColor: "text-green-600" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.color} rounded-lg p-6 border border-gray-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className={`${stat.textColor} text-3xl font-bold mb-1`}>{stat.value}</p>
                  <p className="text-gray-600 text-xs">{stat.subtitle}</p>
                </div>
                <div className={`${stat.textColor} opacity-20`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
      >
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, SKU, or barcode..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Products ({filtered.length})</h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">SKU/Barcode</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Purchase Price</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Selling Price</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Tax%</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((p, idx) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-600">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">SKU: {p.sku}</p>
                        <p className="text-xs text-gray-600">{p.barcode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-gray-900">{p.stock}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">₹{p.purchasePrice}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">₹{p.sellingPrice}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">{p.tax}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : p.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity group">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditing(p)}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

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
            className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.sku}
                  onChange={(e) => setEditing({ ...editing, sku: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Barcode</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.barcode}
                  onChange={(e) => setEditing({ ...editing, barcode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.stock}
                  onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Purchase Price</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.purchasePrice}
                  onChange={(e) => setEditing({ ...editing, purchasePrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.sellingPrice}
                  onChange={(e) => setEditing({ ...editing, sellingPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tax %</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editing.tax}
                  onChange={(e) => setEditing({ ...editing, tax: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => saveProduct(editing)}
                className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

