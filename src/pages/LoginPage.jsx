import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "ADMIN",
      name: "Admin",
      description: "Manage everything - users, inventory, reports, and sales",
      color: "from-red-500 to-red-600",
      icon: "👨‍💼",
      permissions: "Full Access",
    },
    {
      id: "OWNER",
      name: "Owner",
      description: "Manage customers, inventory, and business reports",
      color: "from-blue-500 to-blue-600",
      icon: "👔",
      permissions: "Customers • Inventory • Reports",
    },
    {
      id: "SALES_EXECUTIVE",
      name: "Sales Executive",
      description: "Create bills and manage sales transactions",
      color: "from-green-500 to-green-600",
      icon: "💼",
      permissions: "POS • Inventory View",
    },
  ];

  const handlePhoneSubmit = () => {
    setError("");
    if (!phone.match(/^[0-9]{10}$/)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setStep(2);
  };

  const handleOTPSubmit = () => {
    setError("");
    if (!otp.match(/^[0-9]{4}$/)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setStep(3);
  };

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      login(phone, selectedRole);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            GEO BILLING
          </h1>
          <p className="text-gray-600 font-medium">Sign in to your account</p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    maxLength="10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePhoneSubmit}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all"
              >
                Send OTP
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  We've sent a 4-digit OTP to +91{phone}
                </p>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    maxLength="4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="0000"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-2xl tracking-widest"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOTPSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all"
                >
                  Verify OTP
                </motion.button>
              </div>

              <p className="text-center text-xs text-gray-500">
                Didn't receive? <span className="text-blue-600 font-semibold cursor-pointer">Resend OTP</span>
              </p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-medium text-center mb-2">
                Select your role to continue
              </p>

              <div className="space-y-3">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? "border-green-500 bg-gradient-to-r " + role.color + " text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">{role.icon}</span>
                      <div className="text-left flex-1">
                        <h3 className={`font-bold text-lg ${selectedRole === role.id ? "text-white" : ""}`}>
                          {role.name}
                        </h3>
                        <p className={`text-sm ${selectedRole === role.id ? "text-green-100" : "text-gray-600"}`}>
                          {role.description}
                        </p>
                        <p className={`text-xs mt-2 ${selectedRole === role.id ? "text-green-100 font-semibold" : "text-gray-500"}`}>
                          {role.permissions}
                        </p>
                      </div>
                      {selectedRole === role.id && (
                        <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep(2);
                    setSelectedRole(null);
                    setError("");
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRoleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
          <p>Demo credentials: Any 10-digit phone • OTP: 1234</p>
        </div>
      </motion.div>
    </div>
  );
}
