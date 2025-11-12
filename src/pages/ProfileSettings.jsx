import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Lock, Bell, Eye, LogOut } from "lucide-react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@billhub.com",
    phone: "+91 98765 43210",
    company: "BillHub Software",
    designation: "Administrator",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    weeklyReport: true,
  });

  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPassword({ ...password, [field]: value });
  };

  const handleNotificationChange = (field) => {
    setNotifications({ ...notifications, [field]: !notifications[field] });
  };

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex gap-2 border-b border-gray-200 overflow-x-auto"
      >
        {["profile", "security", "notifications"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-4 font-bold capitalize transition-all border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </motion.div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => handleProfileChange("company", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                value={profile.designation}
                onChange={(e) => handleProfileChange("designation", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            Change Password
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => handlePasswordChange("new", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm new password"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Update Password
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
              { key: "smsNotifications", label: "SMS Notifications", desc: "Receive important alerts via SMS" },
              { key: "orderUpdates", label: "Order Updates", desc: "Get notified about new orders" },
              { key: "weeklyReport", label: "Weekly Report", desc: "Receive weekly business summary" },
            ].map((notif) => (
              <motion.div
                key={notif.key}
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.02)" }}
                className="p-4 rounded-xl border border-gray-200 flex items-center justify-between transition-colors cursor-pointer hover:border-primary/20"
                onClick={() => handleNotificationChange(notif.key)}
              >
                <div>
                  <p className="font-bold text-gray-900">{notif.label}</p>
                  <p className="text-sm text-gray-600">{notif.desc}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-14 h-8 rounded-full transition-all ${
                    notifications[notif.key] ? "bg-gradient-primary" : "bg-gray-300"
                  } flex items-center p-1`}
                >
                  <motion.div
                    animate={{ x: notifications[notif.key] ? 24 : 0 }}
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-red-50 rounded-2xl border border-red-200 shadow-sm p-8 max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-red-700 mb-6">Sign out from all devices and log out of your account.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
