import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Users,
  Box,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  TrendingUp,
  Truck,
  Package,
  ChevronDown,
  Receipt,
  Bell,
  Trash2,
  CheckCheck,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

function IconBtn({ icon: Icon, label, active, to, hasSubmenu, isOpen, onClick }) {
  return (
    <Link to={to || "#"} onClick={onClick}>
      <motion.div
        whileHover={{ x: 5 }}
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          active
            ? "bg-white/15 text-white shadow-lg"
            : "text-white/70 hover:text-white/90 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="truncate font-medium text-sm">{label}</span>
        </div>
        {hasSubmenu && (
          <ChevronDown
            className={`w-4 h-4 transition-transform flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, userRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportSubmenuOpen, setReportSubmenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount,
  } = useContext(NotificationContext);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "sale":
        return "🛍️";
      case "product":
        return "📦";
      case "transit":
        return "🚚";
      default:
        return "📢";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "POS Billing", icon: ShoppingCart, path: "/pos" },
    { label: "Inventory", icon: Box, path: "/inventory" },
    { label: "Customers", icon: Users, path: "/customers" },
  ];

  const reportItems = [
    { label: "Analytics", icon: BarChart3, path: "/reports" },
    { label: "Seller Reports", icon: TrendingUp, path: "/reports/sellers" },
    { label: "Stock Reports", icon: Package, path: "/reports/stock" },
    { label: "Transit Reports", icon: Truck, path: "/reports/transit" },
    { label: "Tax Reports", icon: Receipt, path: "/reports/tax" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-dark-sidebar to-dark-sidebar/95 text-white flex-col border-r border-white/5">
        {/* Logo Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 border-b border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-white shadow-lg">
              💰
            </div>
            <div>
              <h1 className="font-bold text-lg">Geo Billing</h1>
              <p className="text-xs text-white/60">Billing Suite</p>
            </div>
          </div>
        </motion.div>

        {/* Notifications Panel */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border-b border-white/10 p-4"
        >
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-4 right-4 top-full mt-2 bg-dark-sidebar border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
            >
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <>
                  {/* Notification List */}
                  <div className="divide-y divide-white/5">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 cursor-pointer transition-all duration-200 ${
                          !notif.read
                            ? "bg-gradient-to-r from-white/10 to-white/5 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10"
                            : "bg-transparent hover:bg-white/3 opacity-60"
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <span className={`text-xl flex-shrink-0 transition-opacity ${
                            !notif.read ? "" : "opacity-50"
                          }`}>
                            {getNotificationIcon(notif.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate transition-colors ${
                              !notif.read ? "text-white" : "text-white/60"
                            }`}>
                              {notif.title}
                            </p>
                            <p className={`text-xs line-clamp-2 mt-1 transition-colors ${
                              !notif.read ? "text-white/60" : "text-white/40"
                            }`}>
                              {notif.message}
                            </p>
                            <p className={`text-xs mt-2 transition-colors ${
                              !notif.read ? "text-white/40" : "text-white/30"
                            }`}>
                              {formatTime(notif.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notif.id);
                            }}
                            className={`transition-colors ${
                              !notif.read
                                ? "text-white/40 hover:text-white/70"
                                : "text-white/20 hover:text-white/40"
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-white/5 p-3 flex gap-2">
                    <button
                      onClick={() => markAllAsRead()}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                    <button
                      onClick={() => clearAllNotifications()}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear all
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item, idx) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <IconBtn
                icon={item.icon}
                label={item.label}
                active={isActive(item.path)}
                to={item.path}
              />
            </motion.div>
          ))}

          {/* Reports Submenu */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: navItems.length * 0.05 }}
          >
            <button
              onClick={() => setReportSubmenuOpen(!reportSubmenuOpen)}
              className="w-full text-left"
            >
              <IconBtn
                icon={BarChart3}
                label="Reports"
                active={location.pathname.startsWith("/reports")}
                hasSubmenu={true}
                isOpen={reportSubmenuOpen}
              />
            </button>

            {/* Submenu Items */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: reportSubmenuOpen ? 1 : 0,
                height: reportSubmenuOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-1 ml-4 space-y-1 border-l border-white/10 pl-3"
            >
              {reportItems.map((item, idx) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={item.path}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                        isActive(item.path)
                          ? "bg-white/15 text-white shadow-lg"
                          : "text-white/60 hover:text-white/90 hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </nav>

        {/* Settings & Profile */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 border-t border-white/10 space-y-2"
        >
          <IconBtn
            icon={Settings}
            label="Settings"
            active={isActive("/settings")}
            to="/settings"
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
                {user?.role === "ADMIN" ? "👨‍💼" : user?.role === "OWNER" ? "👔" : "💼"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.role || "Guest"}</p>
                <p className="text-xs text-white/60">+91 {user?.phone || "N/A"}</p>
              </div>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-dark-sidebar to-dark-sidebar/90 text-white flex items-center justify-between px-4 z-50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
            💰
          </div>
          <span className="font-bold">Geo Billing</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Notifications Panel */}
      {notificationOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-dark-sidebar text-white border-b border-white/5 max-h-96 overflow-y-auto z-40"
        >
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      !notif.read
                        ? "bg-gradient-to-r from-white/10 to-white/5 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10"
                        : "bg-transparent hover:bg-white/3 opacity-60"
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      <span className={`text-xl flex-shrink-0 transition-opacity ${
                        !notif.read ? "" : "opacity-50"
                      }`}>
                        {getNotificationIcon(notif.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate transition-colors ${
                          !notif.read ? "text-white" : "text-white/60"
                        }`}>
                          {notif.title}
                        </p>
                        <p className={`text-xs line-clamp-2 mt-1 transition-colors ${
                          !notif.read ? "text-white/60" : "text-white/40"
                        }`}>
                          {notif.message}
                        </p>
                        <p className={`text-xs mt-2 transition-colors ${
                          !notif.read ? "text-white/40" : "text-white/30"
                        }`}>
                          {formatTime(notif.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notif.id);
                        }}
                        className={`transition-colors ${
                          !notif.read
                            ? "text-white/40 hover:text-white/70"
                            : "text-white/20 hover:text-white/40"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/5 p-3 flex gap-2">
                <button
                  onClick={() => markAllAsRead()}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
                <button
                  onClick={() => clearAllNotifications()}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-dark-sidebar text-white border-b border-white/5 p-4 space-y-2 z-40 max-h-96 overflow-y-auto"
        >
          {navItems.map((item) => (
            <IconBtn
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={isActive(item.path)}
              to={item.path}
            />
          ))}

          {/* Mobile Reports Submenu */}
          <button
            onClick={() => setReportSubmenuOpen(!reportSubmenuOpen)}
            className="w-full text-left"
          >
            <IconBtn
              icon={BarChart3}
              label="Reports"
              active={location.pathname.startsWith("/reports")}
              hasSubmenu={true}
              isOpen={reportSubmenuOpen}
            />
          </button>

          {reportSubmenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="ml-4 space-y-1 border-l border-white/10 pl-3"
            >
              {reportItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                      isActive(item.path)
                        ? "bg-white/15 text-white shadow-lg"
                        : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}
