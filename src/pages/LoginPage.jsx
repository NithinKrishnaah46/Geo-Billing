import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Lock, CheckCircle2, User, ShieldAlert, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("phone"); // phone, otp, role
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  // Role options
  const roles = [
    {
      id: "sales",
      label: "Sales Executive",
      icon: TrendingUp,
      description: "Manage sales, billing & customers",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "admin",
      label: "Admin",
      icon: ShieldAlert,
      description: "Manage inventory & reports",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "owner",
      label: "Owner",
      icon: User,
      description: "Full access & analytics",
      color: "from-green-500 to-green-600",
    },
  ];

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate phone number (10 digits)
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setStep("otp");
      setError("");
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate OTP (4 digits for demo)
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    // Simulate OTP verification
    if (otp === "1234") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setVerifiedPhone(phoneNumber);
        setStep("role");
        setError("");
      }, 1500);
    } else {
      setError("Invalid OTP. Try 1234 for demo");
    }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setLoading(true);

    // Simulate login
    setTimeout(() => {
      setLoading(false);
      // Save user info to localStorage
      const user = {
        phone: verifiedPhone,
        role: roleId,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Small delay to ensure localStorage is processed
      setTimeout(() => {
        navigate("/");
      }, 100);
    }, 1500);
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setOtpSent(false);
    setError("");
  };

  const handleBackToOtp = () => {
    setStep("otp");
    setSelectedRole("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg"
          >
            <span className="text-3xl">💰</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Geo Billing</h1>
          <p className="text-slate-400">Smart Billing & Inventory System</p>
        </div>

        {/* Card Container */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50"
        >
          {/* PHONE STEP */}
          {step === "phone" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Enter Your Number
                </h2>
                <p className="text-slate-400 text-sm">
                  We'll send you an OTP for verification
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhoneNumber(value);
                      }}
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Format: 10 digits (e.g., 9876543210)</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Send OTP
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center text-slate-400 text-sm">
                <p>Demo: Use any 10-digit number</p>
              </div>
            </div>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Enter OTP
                </h2>
                <p className="text-slate-400 text-sm">
                  We've sent an OTP to +91 {phoneNumber.slice(-10)}
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    OTP Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setOtp(value);
                      }}
                      placeholder="Enter 4-digit OTP"
                      maxLength="4"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white text-center text-2xl font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Demo OTP: 1234</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Verifying OTP...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Verify OTP
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="w-full text-slate-400 hover:text-slate-300 font-medium py-2 rounded-lg transition"
                >
                  ← Back to Phone
                </button>
              </form>

              <div className="text-center text-slate-500 text-xs">
                <p>Didn't receive OTP? <span className="text-blue-400 cursor-pointer hover:underline">Resend</span></p>
              </div>
            </div>
          )}

          {/* ROLE SELECTION STEP */}
          {step === "role" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select Your Role
                </h2>
                <p className="text-slate-400 text-sm">
                  Choose your designation to continue
                </p>
              </div>

              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                    <motion.button
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect(role.id)}
                      disabled={loading}
                      className={`w-full p-4 rounded-xl transition-all duration-300 border-2 relative overflow-hidden group ${
                        isSelected
                          ? "border-blue-500 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                          : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                      }`}
                    >
                      {/* Background gradient on hover */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${role.color} bg-gradient-to-r`}
                      ></div>

                      <div className="relative flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg flex-shrink-0 ${
                            isSelected
                              ? `bg-gradient-to-br ${role.color}`
                              : "bg-slate-600/50"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 text-left">
                          <p className="font-semibold text-white text-sm">
                            {role.label}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {role.description}
                          </p>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 mt-1"
                          >
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(selectedRole)}
                disabled={loading || !selectedRole}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.label : "..."}
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleBackToOtp}
                className="w-full text-slate-400 hover:text-slate-300 font-medium py-2 rounded-lg transition"
              >
                ← Back to OTP
              </button>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Protected by industry-standard encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
