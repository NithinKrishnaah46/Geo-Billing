import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare2, Square, RotateCcw, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";

export default function AdminControlPanel() {
  const { userRole } = useAuth();
  const { togglePermission, getPermissions, resetToDefaults, resetAllPermissions, ALL_PERMISSIONS } = usePermissions();
  const [selectedRole, setSelectedRole] = useState("OWNER");
  const [showResetWarning, setShowResetWarning] = useState(null);

  // Protect admin-only access
  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-light p-4 md:p-8">
        <div className="max-w-2xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
            <p className="text-red-700">Only ADMIN users can access the Control Panel.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentRolePermissions = getPermissions(selectedRole);
  const rolePermissionsList = ALL_PERMISSIONS[selectedRole] || [];
  const roleColors = {
    OWNER: "from-blue-500 to-cyan-500",
    SALES_EXECUTIVE: "from-green-500 to-emerald-500",
  };

  // Group permissions by category
  const groupedPermissions = rolePermissionsList.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">Admin Control Panel</h1>
        </div>
        <p className="text-gray-600">Manage permissions for OWNER and SALES_EXECUTIVE roles</p>
      </motion.div>

      {/* Role Selection Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex gap-4 flex-wrap"
      >
        {Object.keys(ALL_PERMISSIONS).map((role) => (
          <motion.button
            key={role}
            onClick={() => setSelectedRole(role)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedRole === role
                ? `bg-gradient-to-r ${roleColors[role]} text-white shadow-lg`
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary"
            }`}
          >
            {role}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Control Panel */}
      <motion.div
        key={selectedRole}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-md p-8"
      >
        {/* Role Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <h2 className={`text-3xl font-bold bg-gradient-to-r ${roleColors[selectedRole]} bg-clip-text text-transparent`}>
              {selectedRole}
            </h2>
            <p className="text-gray-600 mt-1">
              Control what features {selectedRole} can access and perform
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResetWarning(selectedRole)}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-lg flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset This Role
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResetWarning("ALL")}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-lg flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </motion.button>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="space-y-8">
          {Object.entries(groupedPermissions).map((categoryEntry) => {
            const [category, perms] = categoryEntry;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${roleColors[selectedRole]}`} />
                  <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                  <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {perms.filter((p) => currentRolePermissions[p.key]).length} / {perms.length}
                  </span>
                </div>

                {/* Permission Checkboxes */}
                <div className="grid gap-3 ml-4">
                  {perms.map((perm) => {
                    const isChecked = currentRolePermissions[perm.key];
                    return (
                      <motion.div
                        key={perm.key}
                        whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.02)" }}
                        onClick={() => togglePermission(selectedRole, perm.key)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm"
                      >
                        <motion.div
                          initial={false}
                          animate={{ scale: isChecked ? 1.1 : 1 }}
                          className={`flex-shrink-0 transition-all ${
                            isChecked ? "text-primary" : "text-gray-400"
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare2 className="w-6 h-6" />
                          ) : (
                            <Square className="w-6 h-6" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{perm.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{perm.key}</p>
                        </div>
                        <motion.div
                          initial={false}
                          animate={{
                            backgroundColor: isChecked ? "#10b98166" : "#f3f4f6",
                          }}
                          className="px-3 py-1 rounded-full text-xs font-bold"
                        >
                          {isChecked ? (
                            <span className="text-green-700">ALLOWED</span>
                          ) : (
                            <span className="text-gray-500">BLOCKED</span>
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl"
        >
          <div>
            <p className="text-sm text-gray-600">Total Permissions Available:</p>
            <p className="text-2xl font-bold text-gray-900">
              {rolePermissionsList.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Enabled for {selectedRole}:</p>
            <p className="text-2xl font-bold text-primary">
              {Object.values(currentRolePermissions).filter(Boolean).length} / {rolePermissionsList.length}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      {showResetWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowResetWarning(null)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md"
          >
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Permissions?</h3>
            <p className="text-gray-600 mb-6">
              {showResetWarning === "ALL"
                ? "This will reset ALL permissions for both OWNER and SALES_EXECUTIVE to default settings. This action cannot be undone."
                : `This will reset all permissions for ${showResetWarning} to default settings. This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResetWarning(null)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (showResetWarning === "ALL") {
                    resetAllPermissions();
                  } else {
                    resetToDefaults(showResetWarning);
                  }
                  setShowResetWarning(null);
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-all"
              >
                Reset
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
