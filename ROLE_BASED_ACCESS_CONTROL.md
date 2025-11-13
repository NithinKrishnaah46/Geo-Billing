# 🔐 Role-Based Access Control (RBAC) - Geo Billing

## Overview
This document outlines the complete permission matrix and access control for the Geo Billing application across three user roles: **ADMIN**, **OWNER**, and **SALES_EXECUTIVE**.

### Key Principle
**One phone number = One role at a time**
- When a user logs in with a specific phone number and role, they cannot simultaneously access features of other roles
- If a user tries to switch roles, the previous session is automatically logged out
- Each login creates a fresh session with that specific role

---

## 📊 ROLE DEFINITIONS

### 1. **ADMIN** - System Administrator (Full Access)
**Responsibilities:** System management, all operations, audit, user management
**Phone Example:** +91 9999999999

#### Accessible Pages:
- ✅ Dashboard
- ✅ POS Billing (View, Add, Edit, Delete, Export)
- ✅ Inventory (View, Add, Edit, Delete, Export, Import)
- ✅ Customers (View, Add, Edit, Delete, Export, Import)
- ✅ Analytics/Sales Reports (View, Export)
- ✅ Seller Reports (View, Add, Edit, Delete, Export)
- ✅ Stock Reports (View, Add, Edit, Delete, Export)
- ✅ Transit Reports (View, Export)
- ✅ Tax Reports (View, Edit, Delete, Export)
- ✅ Settings (View, Edit)

#### Capabilities:
| Feature | Capability |
|---------|-----------|
| View all data | ✅ Full access to all reports and analytics |
| Add/Create | ✅ Can add products, customers, invoices, sellers, stock items |
| Edit | ✅ Can edit any data in the system |
| Delete | ✅ Can delete any data (with audit trail) |
| Export | ✅ Export all data to Excel/CSV |
| Import | ✅ Import products and customers from Excel/CSV |
| Reports | ✅ View all reports: Sales, Stock, Transit, Tax, Seller |
| Settings | ✅ Modify system settings and configuration |
| Audit | ✅ View audit logs of all user actions |

---

### 2. **OWNER** - Business Owner (Management Access)
**Responsibilities:** Business oversight, inventory management, customer relations, financial monitoring
**Phone Example:** +91 8888888888

#### Accessible Pages:
- ✅ Dashboard (View only)
- ❌ POS Billing (No access - sales operations managed by Sales Executive)
- ✅ Inventory (View, Add, Edit, Delete, Export, Import)
- ✅ Customers (View, Add, Edit, Delete, Export, Import)
- ✅ Analytics/Sales Reports (View, Export)
- ✅ Seller Reports (View, Add, Edit, Delete, Export)
- ✅ Stock Reports (View, Add, Edit, Delete, Export)
- ✅ Transit Reports (View, Export)
- ✅ Tax Reports (View, Edit, Delete, Export)
- ⚠️ Settings (View only - cannot modify)

#### Capabilities:
| Feature | Capability |
|---------|-----------|
| Dashboard | ✅ View business overview and KPIs |
| Inventory | ✅ Manage all inventory (add/edit/delete stock items) |
| Customers | ✅ Manage customer relationships and payment tracking |
| Reports | ✅ View all financial and operational reports |
| Stock Management | ✅ Monitor and update stock levels (triggers owner notifications) |
| Customer Dues | ✅ Track and manage customer payment dues |
| Seller Management | ✅ Add/edit/delete suppliers and vendors |
| Tax Compliance | ✅ Edit and manage tax invoices and compliance |
| Export Data | ✅ Export all reports to Excel for analysis |
| Import Data | ✅ Import bulk customer and inventory data |
| Settings | ❌ Cannot modify system settings |

#### Notifications:
- 📢 **New Stock Added:** Owner receives notification when new products are added to inventory
- 📢 **Customer Due Payment:** Owner receives notification when a customer has a pending payment/due amount

---

### 3. **SALES_EXECUTIVE** - Sales Staff (Operational Access)
**Responsibilities:** Day-to-day sales operations, POS transactions, customer service
**Phone Example:** +91 7777777777

#### Accessible Pages:
- ✅ Dashboard (View only)
- ✅ POS Billing (View, Add, Edit, Delete, Export)
- ✅ Inventory (View only - cannot add/edit/delete)
- ✅ Customers (View only - cannot add/edit/delete)
- ❌ Analytics/Sales Reports (No access)
- ❌ Seller Reports (No access)
- ❌ Stock Reports (No access)
- ❌ Transit Reports (No access)
- ❌ Tax Reports (No access)
- ❌ Settings (No access)

#### Capabilities:
| Feature | Capability |
|---------|-----------|
| Dashboard | ✅ View personal sales dashboard |
| POS Billing | ✅ Create invoices, process sales transactions, export billing |
| Inventory | ✅ View product list and stock levels ONLY |
| Customers | ✅ View customer information ONLY |
| Add Products | ❌ Cannot add new products to inventory |
| Edit Products | ❌ Cannot edit product details |
| Delete Products | ❌ Cannot delete products |
| Import Products | ❌ Cannot import bulk products |
| Manage Customers | ❌ Cannot add/edit/delete customer details |
| Import Customers | ❌ Cannot import bulk customers |
| View Reports | ❌ No access to any reports or analytics |
| Export Reports | ❌ Cannot export reports (can only export POS invoices) |

#### Limitations:
- 🚫 Cannot see financial reports or analytics
- 🚫 Cannot access supplier/seller management
- 🚫 Cannot modify inventory levels
- 🚫 Cannot manage customer records
- 🚫 Cannot access tax or compliance reports
- 🚫 Cannot access system settings

---

## 🔒 ROLE ISOLATION & SESSION MANAGEMENT

### Single Session Enforcement
```
Phone Number: +91 9999999999
├─ Login as ADMIN ✅
│  └─ Session Active: ADMIN_ONLY
│     └─ Can access: All features
│     └─ Cannot access: Owner or Sales Executive features
│
└─ If switches to OWNER role:
   ├─ Previous ADMIN session logs out automatically
   ├─ New session created: OWNER_ONLY
   └─ Can now access: Owner features only
```

### Key Rules:
1. **One User = One Role at a Time**
   - A phone number can only be logged in with ONE role simultaneously
   - Switching roles automatically logs out the previous session

2. **No Cross-Role Access**
   - ADMIN logged in cannot access OWNER-only features
   - OWNER logged in cannot access ADMIN-only features
   - SALES_EXECUTIVE cannot access ADMIN or OWNER features

3. **Session Persistence**
   - Current user stored in localStorage as JSON
   - Session persists on page refresh (same role maintains)
   - Logout clears the session completely

4. **Phone Number Authentication**
   - Phone + Role combination creates unique session
   - Same phone, different role = new session (old one logged out)
   - Different phone = new user session

---

## 📋 FEATURE-BY-PAGE ACCESS MATRIX

### Dashboard
| Role | Access | Actions |
|------|--------|---------|
| ADMIN | ✅ | View all KPIs, sales, stock metrics |
| OWNER | ✅ | View business overview and due payments |
| SALES_EXECUTIVE | ✅ | View personal sales dashboard |

### POS Billing
| Role | View | Add | Edit | Delete | Export |
|------|------|-----|------|--------|--------|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ |
| OWNER | ❌ | ❌ | ❌ | ❌ | ❌ |
| SALES_EXECUTIVE | ✅ | ✅ | ✅ | ✅ | ✅ |

### Inventory
| Role | View | Add | Edit | Delete | Export | Import |
|------|------|-----|------|--------|--------|--------|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| OWNER | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SALES_EXECUTIVE | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

### Customers
| Role | View | Add | Edit | Delete | Export | Import |
|------|------|-----|------|--------|--------|--------|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| OWNER | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SALES_EXECUTIVE | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

### Reports (Analytics, Seller, Stock, Transit, Tax)
| Role | View | Add | Edit | Delete | Export |
|------|------|-----|------|--------|--------|
| ADMIN | ✅ | Varies | ✅ | ✅ | ✅ |
| OWNER | ✅ | Varies | ✅ | ✅ | ✅ |
| SALES_EXECUTIVE | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🎯 IMPLEMENTATION DETAILS

### Authentication Flow
```javascript
// Login
login("+91 9999999999", "ADMIN")
// Creates user object:
// {
//   id: "user_1234567890",
//   phone: "+91 9999999999",
//   role: "ADMIN",
//   name: "ADMIN User",
//   loginTime: "2024-11-13T10:30:00Z"
// }

// Logout
logout()
// Clears user object and session

// Switch Role
switchRole("+91 9999999999", "OWNER")
// Logs out previous ADMIN session
// Creates new OWNER session with same phone
```

### Role Checking
```javascript
// In any component:
const { userRole } = useAuth();

// Conditional rendering
{userRole === "ADMIN" && <AdminOnlyFeature />}
{(userRole === "ADMIN" || userRole === "OWNER") && <ManagerFeature />}
{userRole === "SALES_EXECUTIVE" && <SalesFeature />}
```

---

## 🚨 PERMISSION VIOLATIONS & SECURITY

### What Happens If Role Tries to Access Unauthorized Feature:
1. **UI Level:** Buttons/features are hidden based on `userRole` check
2. **Route Level:** ProtectedRoute components prevent navigation
3. **Data Level:** API/localStorage checks prevent data access
4. **Notification:** User sees error/warning message

### Example:
```javascript
// SALES_EXECUTIVE tries to access Tax Reports
// Result: Page shows "Access Denied - This page is only for ADMIN and OWNER"
// Navigation: Redirected back to Dashboard
```

---

## ✅ CURRENT IMPLEMENTATION STATUS

### ✅ Completed
- [x] Login/Logout system with phone + role
- [x] Role-based navigation in sidebar (Navbar)
- [x] Dashboard role-based views
- [x] POS Billing - ADMIN/SALES_EXECUTIVE only
- [x] Inventory - ADMIN/OWNER can add/edit/delete, SALES_EXECUTIVE view-only
- [x] Customers - ADMIN/OWNER can add/edit/delete, SALES_EXECUTIVE view-only
- [x] Reports visibility (Analytics, Seller, Stock, Transit, Tax)
- [x] Export success modal for all users
- [x] Seller Reports - ADMIN/OWNER can add/edit/delete
- [x] Stock Reports - ADMIN/OWNER can add/edit/delete
- [x] Tax Reports - ADMIN/OWNER can edit/delete invoices
- [x] Owner notifications for customer dues and new stock
- [x] Role isolation in AuthContext (single session per login)

### 📦 Export/Import Capabilities
- **ADMIN:** Can export/import all data types
- **OWNER:** Can export/import inventory and customers
- **SALES_EXECUTIVE:** Can export POS invoices, cannot import

---

## 🔄 FUTURE ENHANCEMENTS

1. **Backend Validation:** Add server-side permission checks
2. **Audit Trail:** Log all actions by user role
3. **Session Timeout:** Auto-logout after inactivity
4. **Multi-Device Prevention:** Prevent same phone from logging in on multiple devices
5. **Role-Based API Endpoints:** Server validates role before returning data
6. **Encryption:** Encrypt sensitive data based on role access
7. **Compliance Reports:** Generate access logs for regulatory compliance

---

## 📞 SUPPORT & QUESTIONS

For questions about role permissions or access control, refer to this matrix or contact the system administrator.

**Last Updated:** November 13, 2025
**Version:** 1.0
