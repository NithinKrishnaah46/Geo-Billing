import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const login = (phone, role) => {
    const newUser = {
      id: `user_${Date.now()}`,
      phone,
      role,
      name: `${role} User`,
      loginTime: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const userRole = user?.role || null;

  // Permission checker
  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      ADMIN: [
        "view_dashboard",
        "manage_pos",
        "manage_inventory",
        "manage_customers",
        "view_reports",
        "manage_reports",
        "export_all",
        "import_all",
        "manage_users",
        "view_audit",
      ],
      OWNER: [
        "view_dashboard",
        "manage_customers",
        "view_inventory",
        "view_reports",
        "manage_transit_reports",
        "manage_tax_reports",
        "export_own",
      ],
      SALES_EXECUTIVE: [
        "view_customers",
        "manage_pos",
        "view_inventory",
      ],
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    userRole,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
