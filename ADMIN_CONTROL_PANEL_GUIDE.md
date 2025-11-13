# 🎛️ Admin Control Panel - Implementation Guide

## Overview
The **Admin Control Panel** is a new feature that allows ADMIN users to dynamically control what features are available to OWNER and SALES_EXECUTIVE roles without code changes.

---

## 🆕 New Components & Files

### 1. **PermissionsContext** (`src/context/PermissionsContext.js`)
**Purpose:** Global state management for role-specific permissions

**Key Features:**
- Stores default permissions for OWNER and SALES_EXECUTIVE
- Provides `usePermissions()` hook for components
- Persists permissions to localStorage
- Functions:
  - `togglePermission(role, permissionKey)` - Toggle a feature on/off for a role
  - `hasPermission(userRole, permissionKey)` - Check if a role has a specific permission
  - `getPermissions(userRole)` - Get all permissions for a role
  - `resetToDefaults(role)` - Reset a single role to default permissions
  - `resetAllPermissions()` - Reset all roles to defaults

**Default Permissions:**
```javascript
OWNER: {
  view_dashboard: true,
  manage_customers: true,
  view_inventory: true,
  manage_inventory: true,
  view_reports: true,
  manage_reports: true,
  export_all: true,
  import_all: true,
  view_pos: false,        // ← OWNER cannot see POS by default
  manage_pos: false,
}

SALES_EXECUTIVE: {
  view_dashboard: true,
  view_customers: true,
  manage_customers: false, // ← SALES_EXEC cannot edit customers
  view_inventory: true,
  manage_inventory: false, // ← SALES_EXEC cannot edit inventory
  manage_pos: true,
  view_reports: false,     // ← SALES_EXEC cannot see reports
  import_all: false,
}
```

### 2. **Admin Control Panel Page** (`src/pages/admin-control-panel.jsx`)
**Purpose:** UI for managing permissions

**Features:**
- ✅ **Role Selection Tabs** - Switch between OWNER and SALES_EXECUTIVE
- ✅ **Permission Checkboxes** - Enable/disable features grouped by category
  - Categories: Dashboard, Inventory, Customers, POS, Reports, Data
- ✅ **Real-time Stats** - Shows how many permissions are enabled for a role
- ✅ **Reset Buttons** - Reset to defaults with confirmation modal
- ✅ **Access Control** - Only ADMIN users can access this page
- ✅ **Framer Motion Animations** - Smooth transitions and interactions

**UI Sections:**
```
┌─────────────────────────────────────────┐
│ Admin Control Panel                     │
├─────────────────────────────────────────┤
│ [OWNER] [SALES_EXECUTIVE]               │ ← Role tabs
├─────────────────────────────────────────┤
│                                         │
│ [Reset This Role] [Reset All]          │ ← Action buttons
│                                         │
│ Dashboard                               │ ← Category header
│  ☑ View Dashboard                       │ ← Permission with checkbox
│  ☐ View POS Billing                     │
│                                         │
│ Inventory                               │
│  ☑ View Inventory                       │
│  ☑ Add/Edit/Delete Inventory            │
│                                         │
│ ──────────────────────────────────────  │
│ Total Permissions: 11                  │ ← Stats footer
│ Enabled for OWNER: 8 / 11              │
└─────────────────────────────────────────┘
```

---

## 🔧 How It Works

### 1. **Admin Changes a Permission**
```
ADMIN user visits: http://localhost:3001/admin/control-panel
↓
Selects OWNER tab
↓
Clicks checkbox for "Manage POS Billing"
↓
togglePermission("OWNER", "manage_pos") is called
↓
State updates: OWNER.manage_pos = true
↓
localStorage.rolePermissions is updated
↓
Component re-renders with new stats
```

### 2. **Owner User Sees Updated Permissions**
```
OWNER user navigates to Navbar
↓
Navbar checks: userRole === "OWNER" and can manage POS?
↓
POS Billing link now appears/disappears based on permission
↓
If permission enabled: ✅ "POS Billing" appears in sidebar
If permission disabled: ❌ "POS Billing" is hidden
```

### 3. **Permission Persistence**
```
Permissions stored in localStorage under key: "rolePermissions"
↓
Format: {
  OWNER: { view_dashboard: true, manage_pos: false, ... },
  SALES_EXECUTIVE: { ... }
}
↓
Persists across:
  - Page refreshes
  - Tab switches
  - Browser restarts
  - App redeployments
```

---

## 📋 Default Permission Matrix

### OWNER - Can Control:
| Feature | Default | Changeable |
|---------|---------|-----------|
| Dashboard | ✅ View | Yes |
| Inventory | ✅ View, Edit, Delete | Yes |
| Customers | ✅ View, Edit, Delete | Yes |
| Reports | ✅ View, Edit, Delete | Yes |
| POS Billing | ❌ Cannot Access | Yes |
| Data Export | ✅ Export, Import | Yes |

### SALES_EXECUTIVE - Can Control:
| Feature | Default | Changeable |
|---------|---------|-----------|
| Dashboard | ✅ View | Yes |
| Inventory | ✅ View Only | Yes |
| Customers | ✅ View Only | Yes |
| POS Billing | ✅ Full Access | Yes |
| Reports | ❌ Cannot Access | Yes |
| Data Export | ⚠️ Export Only | Yes |

---

## 🚀 Integration Steps

### Step 1: PermissionsProvider Wraps App
```javascript
// src/App.js
<AuthProvider>
  <PermissionsProvider>        {/* ← Added */}
    <ExportSuccessProvider>
      <NotificationProvider>
        ...
      </NotificationProvider>
    </ExportSuccessProvider>
  </PermissionsProvider>        {/* ← Added */}
</AuthProvider>
```

### Step 2: Route Added to App
```javascript
// src/App.js
<Route path="/admin/control-panel" element={<AdminControlPanel />} />
```

### Step 3: Navbar Updated
```javascript
// src/components/Navbar.jsx
{userRole === "ADMIN" && (
  <IconBtn
    icon={Shield}
    label="Control Panel"
    active={isActive("/admin/control-panel")}
    to="/admin/control-panel"
  />
)}
```

---

## 💡 Usage Examples

### Example 1: Admin Enables POS for OWNER
```
1. Admin logs in with phone and ADMIN role
2. Navigates to Settings → Control Panel
3. Selects OWNER tab
4. Finds "POS Billing" → "Manage POS Billing"
5. Clicks checkbox to enable
6. OWNER's next page refresh shows POS link in sidebar
```

### Example 2: Admin Disables Reports for SALES_EXECUTIVE
```
1. Admin visits Control Panel
2. Switches to SALES_EXECUTIVE tab
3. Finds Reports category
4. Unchecks all report permissions
5. SALES_EXECUTIVE no longer sees Reports menu item
```

### Example 3: Reset to Defaults
```
1. Admin made several permission changes
2. Wants to revert to original defaults
3. Clicks [Reset This Role] or [Reset All]
4. Confirms in modal
5. All permissions restored to default state
```

---

## 🔐 Security & Access Control

### Who Can Access?
```javascript
// Only ADMIN users can see/access Control Panel
if (userRole !== "ADMIN") {
  return (
    <div>Access Denied - Only ADMIN users can access this page</div>
  )
}
```

### What's Protected?
- ✅ Page route requires ADMIN role
- ✅ UI hidden for non-admin users
- ✅ Permission changes only affect non-admin roles
- ✅ ADMIN always has all permissions (cannot be restricted)

---

## 📝 Implementation in Components

### Using Permissions in Components

#### Option 1: Direct Check (Simple)
```javascript
import { usePermissions } from "../context/PermissionsContext";
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { userRole } = useAuth();
  const { hasPermission } = usePermissions();
  
  if (hasPermission(userRole, "manage_pos")) {
    return <POSPanel />;
  }
  return <p>Access Denied</p>;
}
```

#### Option 2: Group Check (Multiple Permissions)
```javascript
const { hasPermission } = usePermissions();

const canEditInventory = 
  hasPermission(userRole, "view_inventory") && 
  hasPermission(userRole, "manage_inventory");

if (canEditInventory) {
  return <EditInventoryForm />;
}
```

#### Option 3: In Navbar (Show/Hide Links)
```javascript
// Current implementation:
const visibleNavItems = navItems.filter(item => {
  return item.roles.includes(userRole);
});

// Could be updated to use permissions:
const visibleNavItems = navItems.filter(item => {
  if (item.roles.includes(userRole)) {
    // Check if this role has permission for this feature
    return hasPermission(userRole, item.permissionKey);
  }
  return false;
});
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ ADMIN Control Panel                                 │
│ ┌───────────────────────────────────────────────┐   │
│ │ Toggle Permission Checkbox                   │   │
│ └──────────────┬──────────────────────────────┘   │
│                │                                    │
│                ▼                                    │
│ ┌───────────────────────────────────────────────┐   │
│ │ togglePermission(role, key)                  │   │
│ │ Updates state & localStorage                 │   │
│ └──────────────┬──────────────────────────────┘   │
│                │                                    │
│                ▼                                    │
└──────────────────────────────────────────────────────
               │
               │ Persisted to localStorage
               │
               ▼
┌──────────────────────────────────────────────────────┐
│ OWNER/SALES_EXEC Pages                              │
│ ┌───────────────────────────────────────────────┐   │
│ │ const { hasPermission } = usePermissions()   │   │
│ │ if (hasPermission(userRole, "manage_pos"))  │   │
│ │   return <POSPanel />                        │   │
│ └───────────────────────────────────────────────┘   │
│                │                                     │
│                ▼                                     │
│ ✅ Component renders OR ❌ Access denied shown      │
└──────────────────────────────────────────────────────┘
```

---

## 📊 Statistics Display

The Control Panel shows real-time stats:

```
┌─────────────────────────────────┐
│ Total Permissions Available: 11 │
│ Enabled for OWNER: 8 / 11      │
└─────────────────────────────────┘
```

**Automatically Updates When:**
- Admin checks a permission checkbox
- Admin unchecks a permission checkbox
- Admin clicks "Reset to Defaults"
- Tab switches to a different role

---

## 🧪 Testing the Feature

### Test 1: Access Control
```
1. Log in as SALES_EXECUTIVE
2. Try to visit /admin/control-panel
3. Expected: See "Access Denied" message
4. Non-admin cannot access Control Panel ✅
```

### Test 2: Permission Toggle
```
1. Log in as ADMIN
2. Go to Control Panel
3. Switch to OWNER tab
4. Toggle "Manage POS Billing" ON
5. Refresh page
6. Expected: Checkbox is still ON ✅
```

### Test 3: Persistence
```
1. ADMIN enables "Manage POS" for OWNER
2. ADMIN logs out
3. OWNER logs in
4. Sidebar shows POS Billing link ✅
5. OWNER can access POS page ✅
```

### Test 4: Reset
```
1. ADMIN makes permission changes
2. Clicks [Reset This Role]
3. Confirms in modal
4. Permissions return to defaults ✅
5. Stats update correctly ✅
```

---

## 🎯 Next Steps / Future Enhancements

1. **Backend Integration**
   - Move permissions from localStorage to database
   - Add API endpoints for permission management
   - Server-side validation of permissions

2. **Audit Logging**
   - Log all permission changes by ADMIN
   - Show history of who changed what and when
   - Revert to previous permission states

3. **Role Templates**
   - Save permission sets as "templates"
   - Quickly apply predefined permission profiles
   - Example: "Viewer-Only", "Manager", "Full Access"

4. **Permission Groups**
   - Group related permissions (e.g., "Inventory Management")
   - Enable/disable entire groups with one click
   - More granular control options

5. **Real-time Updates**
   - Use WebSockets to notify users when permissions change
   - Automatically refresh pages when permissions are revoked
   - Real-time permission sync across devices

6. **Bulk Operations**
   - Change permissions for multiple roles at once
   - Copy permissions from one role to another
   - Batch import/export permission configurations

---

## 📞 Troubleshooting

### Issue: Control Panel link not showing
- **Cause:** User is not logged in as ADMIN
- **Solution:** Log in with ADMIN role first

### Issue: Permission changes not taking effect
- **Cause:** User's page needs to be refreshed
- **Solution:** Refresh the page or log in again

### Issue: Permissions reset to defaults after refresh
- **Cause:** localStorage not being used correctly
- **Solution:** Check browser DevTools → Application → localStorage
- **Key:** `rolePermissions`

### Issue: Non-admin can access Control Panel URL
- **Cause:** Missing access control check
- **Solution:** Component has access guard (returns "Access Denied" if not ADMIN)

---

## 📄 Files Modified/Created

### New Files:
- ✅ `src/context/PermissionsContext.js` - Permission state management
- ✅ `src/pages/admin-control-panel.jsx` - Control panel UI

### Modified Files:
- ✅ `src/App.js` - Added PermissionsProvider, added route
- ✅ `src/context/AuthContext.js` - Updated hasPermission function
- ✅ `src/Components/Navbar.jsx` - Added Control Panel link

---

## 🎉 Summary

The **Admin Control Panel** provides a user-friendly way to manage role-based permissions without touching code:

- 🎯 **Easy to Use** - Intuitive checkbox interface
- 💾 **Persistent** - Changes saved to localStorage
- 🔐 **Secure** - Only ADMIN users can access
- 📊 **Transparent** - Real-time stats show enabled permissions
- ⚡ **Fast** - Instant updates without page reload
- 🔄 **Reversible** - Reset to defaults anytime

**Location:** Settings → Control Panel (visible only to ADMIN users)
