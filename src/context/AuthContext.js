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
    // Logout any previous user first - ensures only ONE user session at a time
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

  const switchRole = (phone, newRole) => {
    // This function ensures switching roles logs out the previous user
    // A phone number can only be logged in with ONE role at a time
    if (user && user.phone === phone) {
      // Same phone, different role - logout and login with new role
      logout();
      return login(phone, newRole);
    }
    // Different phone - logout previous user
    logout();
    return login(phone, newRole);
  };

  const isAuthenticated = !!user;
  const userRole = user?.role || null;

  // Permission checker (ADMIN has all permissions by default)
  // For other roles, use PermissionsContext
  const hasPermission = (permission) => {
    if (!user) return false;

    // ADMIN always has all permissions
    if (user.role === "ADMIN") {
      return true;
    }

    // For OWNER and SALES_EXECUTIVE, use PermissionsContext
    // Components should use usePermissions hook for role-specific permissions
    return false;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    userRole,
    login,
    logout,
    switchRole,
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
