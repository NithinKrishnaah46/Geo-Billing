import React, { createContext, useState, useContext, useEffect } from "react";

const PermissionsContext = createContext();

const DEFAULT_PERMISSIONS = {
  OWNER: {
    view_dashboard: true,
    manage_customers: true,
    view_inventory: true,
    manage_inventory: true,
    view_reports: true,
    manage_reports: true,
    export_all: true,
    import_all: true,
    view_pos: false,
    manage_pos: false,
    manage_users: false,
    view_audit: false,
  },
  SALES_EXECUTIVE: {
    view_dashboard: true,
    view_customers: true,
    manage_customers: false,
    view_inventory: true,
    manage_inventory: false,
    manage_pos: true,
    view_reports: false,
    manage_reports: false,
    export_pos: true,
    import_all: false,
    manage_users: false,
    view_audit: false,
  },
};

const ALL_PERMISSIONS = {
  OWNER: [
    { key: "view_dashboard", label: "View Dashboard", category: "Dashboard" },
    { key: "view_inventory", label: "View Inventory", category: "Inventory" },
    { key: "manage_inventory", label: "Add/Edit/Delete Inventory", category: "Inventory" },
    { key: "view_customers", label: "View Customers", category: "Customers" },
    { key: "manage_customers", label: "Add/Edit/Delete Customers", category: "Customers" },
    { key: "export_all", label: "Export Data", category: "Data" },
    { key: "import_all", label: "Import Data", category: "Data" },
    { key: "view_reports", label: "View All Reports", category: "Reports" },
    { key: "manage_reports", label: "Edit/Delete Reports", category: "Reports" },
    { key: "view_pos", label: "View POS Billing", category: "POS" },
    { key: "manage_pos", label: "Manage POS Billing", category: "POS" },
  ],
  SALES_EXECUTIVE: [
    { key: "view_dashboard", label: "View Dashboard", category: "Dashboard" },
    { key: "view_inventory", label: "View Inventory", category: "Inventory" },
    { key: "manage_inventory", label: "Add/Edit/Delete Inventory", category: "Inventory" },
    { key: "view_customers", label: "View Customers", category: "Customers" },
    { key: "manage_customers", label: "Add/Edit/Delete Customers", category: "Customers" },
    { key: "manage_pos", label: "Manage POS Billing", category: "POS" },
    { key: "export_pos", label: "Export POS Data", category: "Data" },
    { key: "view_reports", label: "View Reports", category: "Reports" },
    { key: "manage_reports", label: "Edit/Delete Reports", category: "Reports" },
  ],
};

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem("rolePermissions");
    return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS;
  });

  // Save to localStorage whenever permissions change
  useEffect(() => {
    localStorage.setItem("rolePermissions", JSON.stringify(permissions));
  }, [permissions]);

  const togglePermission = (role, permissionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionKey]: !prev[role][permissionKey],
      },
    }));
  };

  const hasPermission = (userRole, permissionKey) => {
    return permissions[userRole]?.[permissionKey] ?? false;
  };

  const getPermissions = (userRole) => {
    return permissions[userRole] || {};
  };

  const resetToDefaults = (role) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: DEFAULT_PERMISSIONS[role],
    }));
  };

  const resetAllPermissions = () => {
    setPermissions(DEFAULT_PERMISSIONS);
  };

  const value = {
    permissions,
    togglePermission,
    hasPermission,
    getPermissions,
    resetToDefaults,
    resetAllPermissions,
    ALL_PERMISSIONS,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }
  return context;
}
