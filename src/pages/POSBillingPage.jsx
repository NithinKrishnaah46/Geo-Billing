import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { Search, Barcode, Plus, Minus, Trash2, Phone, Mail, FileText, Printer, Save, Send, MessageSquare, X, CheckCircle2 } from "lucide-react";

const SAMPLE_PRODUCTS = [
  { id: "p1", name: "T-shirt - Blue", price: 499, sku: "TS-BL-001", stock: 42 },
  { id: "p2", name: "Jeans - Slim", price: 1299, sku: "JN-SL-002", stock: 18 },
  { id: "p3", name: "Sneakers - White", price: 2499, sku: "SN-WH-003", stock: 9 },
  { id: "p4", name: "Cap - Logo", price: 299, sku: "CP-LO-004", stock: 120 },
  { id: "p5", name: "Hoodie - Black", price: 899, sku: "HD-BK-005", stock: 35 },
  { id: "p6", name: "Shorts - Gray", price: 599, sku: "SH-GY-006", stock: 67 },
];

const SAMPLE_CUSTOMERS = [
  { id: "c1", name: "Spice Garden Restaurant", phone: "+91 98765 43210", email: "spice@restaurant.com", gst: "GST123456" },
  { id: "c2", name: "Tech Store", phone: "+91 98765 43211", email: "tech@store.com", gst: "GST789012" },
];

export default function POSBillingPage() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [invoiceNo, setInvoiceNo] = useState("06294");
  const [paymentMode, setPaymentMode] = useState("cash");
  // eslint-disable-next-line no-unused-vars
  const [gstEnabled, setGstEnabled] = useState(true);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("pos_products");
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("pos_customers");
    return saved ? JSON.parse(saved) : SAMPLE_CUSTOMERS;
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", sku: "", stock: "" });
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", gst: "" });
  const [notification, setNotification] = useState(null);

  // Initialize selected customer on first load
  useEffect(() => {
    if (!selectedCustomer && customers.length > 0) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  // Save products and customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pos_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("pos_customers", JSON.stringify(customers));
  }, [customers]);

  const filtered = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  function addProduct() {
    if (newProduct.name.trim() && newProduct.price && newProduct.sku.trim() && newProduct.stock) {
      const product = {
        id: `p${Date.now()}`,
        name: newProduct.name.trim(),
        price: parseFloat(newProduct.price),
        sku: newProduct.sku.trim(),
        stock: parseInt(newProduct.stock),
      };
      setProducts([...products, product]);
      setNewProduct({ name: "", price: "", sku: "", stock: "" });
      setShowAddProductModal(false);
      setNotification({ type: "product", message: "Product added successfully" });
      setTimeout(() => setNotification(null), 3000);
    } else {
      alert("⚠️ Please fill all fields (Name, Price, SKU, Stock)");
    }
  }

  function addCustomer() {
    if (newCustomer.name.trim() && newCustomer.phone.trim() && newCustomer.email.trim()) {
      const customer = {
        id: `c${Date.now()}`,
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim(),
        gst: newCustomer.gst.trim() || "N/A",
      };
      setCustomers([...customers, customer]);
      setSelectedCustomer(customer);
      setNewCustomer({ name: "", phone: "", email: "", gst: "" });
      setShowAddCustomerModal(false);
      setNotification({ type: "customer", message: "Customer added successfully" });
      setTimeout(() => setNotification(null), 3000);
    } else {
      alert("⚠️ Please fill all required fields (Name, Phone, Email)");
    }
  }

  function handleSendSMS() {
    if (!selectedCustomer) {
      alert("⚠️ Please select a customer first");
      return;
    }
    alert(`SMS sent to ${selectedCustomer.phone}:\n\nInvoice #${invoiceNo}\nAmount: ₹${total}\nThank you for your purchase!`);
  }

  function addToCart(product) {
    setCart((c) => {
      const existing = c.find((x) => x.id === product.id);
      if (existing) {
        return c.map((x) =>
          x.id === product.id ? { ...x, qty: Math.min(x.qty + 1, x.stock) } : x
        );
      }
      return [...c, { ...product, qty: 1 }];
    });
  }

  function handleBarcodeInput(e) {
    if (e.key === "Enter" && barcodeInput) {
      const product = products.find(p => p.sku === barcodeInput);
      if (product) {
        addToCart(product);
        setBarcodeInput("");
      } else {
        alert("⚠️ Product not found. Check SKU and try again.");
      }
    }
  }

  function updateQty(id, qty) {
    setCart((c) =>
      c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
    );
  }

  function removeItem(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const cgst = gstEnabled ? Math.round(subtotal * 0.09) : 0;
  const sgst = gstEnabled ? Math.round(subtotal * 0.09) : 0;
  const totalTax = cgst + sgst;
  const total = subtotal + totalTax;

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Billing Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Point of Sale - Billing</h1>
                <p className="text-gray-600 text-sm mt-1">Invoice #{invoiceNo}</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm"
              >
                GST Enabled
              </motion.div>
            </div>

            {/* Customer Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">Select Customer:</span>
                <select
                  value={selectedCustomer?.id || ""}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setSelectedCustomer(customer);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowAddCustomerModal(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </motion.button>
              </div>

              {/* Customer Details */}
              {selectedCustomer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200"
                >
                  <h3 className="font-bold text-gray-900 mb-3">{selectedCustomer.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{selectedCustomer.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-gray-600">GSTIN: </span>
                      <input
                        type="text"
                        placeholder="GSTIN"
                        defaultValue={selectedCustomer.gst}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loyalty Points */}
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-bold text-gray-900">Loyalty Points</p>
                  <p className="text-sm text-gray-600">0</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors"
                >
                  +100
                </motion.button>
              </div>

              {/* Tax Type */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-300">
                <span className="text-sm font-bold text-gray-900">Tax Type:</span>
                <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-semibold">
                  <option>CGST + SGST</option>
                  <option>IGST</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Add Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Barcode className="w-5 h-5 text-green-600" />
                Add Products
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </motion.button>
            </div>

            {/* Barcode Scanner */}
            <div className="mb-4">
              <label className="text-sm font-bold text-gray-700 mb-2 block">Barcode Scanner</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scan barcode or type 890..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={handleBarcodeInput}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-mono"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 font-semibold">
                Sample barcodes: 8903001000001, 8903001000002, 8903001000003
              </p>
            </div>

            {/* Product Search */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Search Product</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 max-h-80 overflow-y-auto pr-2">
              {filtered.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(p)}
                  className="p-3 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <p className="font-bold text-sm text-gray-900 group-hover:text-green-600 truncate">{p.name}</p>
                  <p className="text-xs text-gray-600 font-semibold">₹{p.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.sku}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Invoice Items Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm overflow-x-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Invoice Items</h2>
              <span className="text-sm font-bold text-gray-600">{cart.length} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No items added yet</p>
              </div>
            ) : (
              <div className="min-w-full overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-900">Item</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-900">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-900">Rate</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-900">Disc%</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-900">Tax%</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-900">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{item.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="p-1 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, Number(e.target.value))}
                              className="w-12 px-2 py-1 text-center text-sm font-bold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="p-1 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </motion.button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">₹{item.price}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                          <input type="number" defaultValue="0" className="w-12 px-2 py-1 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">18%</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Payment Summary Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-6 h-fit bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h2>

          {/* Summary Items */}
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Sub Total:</span>
              <span className="text-lg font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            {gstEnabled && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">CGST:</span>
                  <span className="text-sm font-bold text-gray-900">₹{cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">SGST:</span>
                  <span className="text-sm font-bold text-gray-900">₹{sgst.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Tax:</span>
              <span className="text-sm font-bold text-gray-900">₹{totalTax.toLocaleString()}</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
            <p className="text-sm font-medium mb-1">Grand Total:</p>
            <p className="text-3xl font-bold">₹{total.toLocaleString()}</p>
          </div>

          {/* Payment Mode */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900 mb-3">Payment Mode</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "cash", label: "Cash", icon: "💵" },
                { key: "card", label: "Card", icon: "💳" },
                { key: "upi", label: "UPI", icon: "📱" },
                { key: "credit", label: "Credit", icon: "📋" },
              ].map((mode) => (
                <motion.button
                  key={mode.key}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPaymentMode(mode.key)}
                  className={`p-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMode === mode.key
                      ? "bg-green-500 text-white border-2 border-green-600"
                      : "bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-green-500"
                  }`}
                >
                  {mode.icon} {mode.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Invoice
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Invoice
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendSMS}
              className="w-full py-3 rounded-lg border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Send SMS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg border-2 border-green-500 text-green-600 font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send via WhatsApp
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddProductModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Paneer Butter Masala"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="e.g., 280"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">SKU</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="e.g., SKU-2024-001"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Stock</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddProductModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-bold transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addProduct}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
              >
                Add Product
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddCustomerModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Customer</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="e.g., ABC Restaurant"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="e.g., +91 9876543210"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="e.g., customer@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">GST (Optional)</label>
                <input
                  type="text"
                  value={newCustomer.gst}
                  onChange={(e) => setNewCustomer({ ...newCustomer, gst: e.target.value })}
                  placeholder="e.g., GST123456"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCustomerModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-bold transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addCustomer}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
              >
                Add Customer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Notification - Product Added */}
      {notification?.type === "product" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Added</h3>
            <p className="text-gray-600">{notification?.message}</p>
          </motion.div>
        </motion.div>
      )}

      {/* Success Notification - Customer Added */}
      {notification?.type === "customer" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Added</h3>
            <p className="text-gray-600">{notification?.message}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

