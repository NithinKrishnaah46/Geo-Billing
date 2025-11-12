import React, { useState } from "react";
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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportSubmenuOpen, setReportSubmenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

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

        {/* Navigation */}
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
                U
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-white/60">admin@billhub.com</p>
              </div>
            </div>
          </motion.div>
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
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
