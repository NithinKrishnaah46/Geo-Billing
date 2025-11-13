# 🏗️ Admin Control Panel - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Application                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           PermissionsProvider (NEW!)                   │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ State: {                                         │  │    │
│  │  │   OWNER: { manage_pos: false, ... },            │  │    │
│  │  │   SALES_EXECUTIVE: { ... }                      │  │    │
│  │  │ }                                               │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                        │    │
│  │  Functions:                                           │    │
│  │  - togglePermission(role, key)                       │    │
│  │  - hasPermission(role, key) → boolean              │    │
│  │  - resetToDefaults(role)                            │    │
│  │  - resetAllPermissions()                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                       │
│                         ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            Navbar Component                           │    │
│  │  - Displays Control Panel link (ADMIN only)           │    │
│  │  - Shows/hides menu items based on permissions       │    │
│  └────────────────────────────────────────────────────────┘    │
│           │                                    │                │
│           ▼                                    ▼                │
│  ┌──────────────────────┐      ┌──────────────────────────┐   │
│  │  Admin Control Panel │      │  Other Pages             │    │
│  │  /admin/...         │      │  (Inventory, POS, etc)   │    │
│  │                      │      │                          │    │
│  │  - Select role       │      │  - usePermissions hook   │    │
│  │  - Toggle perms      │      │  - Check permissions     │    │
│  │  - See stats         │      │  - Show/hide features    │    │
│  │  - Reset defaults    │      │                          │    │
│  └──────────────────────┘      └──────────────────────────┘    │
│           │                                │                    │
│           └────────────┬───────────────────┘                    │
│                        ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │       localStorage["rolePermissions"]                  │    │
│  │  Persisted across page refreshes & sessions          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
<App.js>
├── <AuthProvider>
│   ├── User: { id, phone, role, ... }
│   └── Functions: login(), logout(), switchRole()
│
├── <PermissionsProvider>  ⭐ NEW
│   ├── Permissions: { OWNER: {...}, SALES_EXECUTIVE: {...} }
│   └── Functions: togglePermission(), hasPermission(), etc.
│
├── <ExportSuccessProvider>
│   └── Export success notifications
│
└── <NotificationProvider>
    └── System notifications
    
Nested Routes:
├── /login → LoginPage
├── / → DashboardPage
├── /pos → POSBillingPage
├── /inventory → InventoryPage
├── /customers → CustomersPage
├── /reports → ReportsPage
├── /settings → ProfileSettings
└── /admin/control-panel → AdminControlPanel ⭐ NEW
```

---

## Data Flow Diagrams

### 1. Admin Toggling a Permission

```
User Interface
┌──────────────────────────────────────────┐
│ Checkbox for "Manage POS Billing"        │
│ Current State: ☐ UNCHECKED               │
└──────────────────────────────────────────┘
                    ▼ (User clicks)
┌──────────────────────────────────────────┐
│ onClick={togglePermission("OWNER",       │
│          "manage_pos")}                  │
└──────────────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ PermissionsContext.togglePermission()    │
│ {                                        │
│   OWNER: {                               │
│     manage_pos: false → true ✅         │
│   }                                      │
│ }                                        │
└──────────────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ Effect Hook: Save to localStorage        │
│ localStorage.setItem(                    │
│   "rolePermissions",                    │
│   JSON.stringify(permissions)            │
│ )                                        │
└──────────────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ Component Re-renders                     │
│ Checkbox now shows: ☑ CHECKED            │
│ Stats update: "Enabled: 9 / 11"         │
└──────────────────────────────────────────┘
```

### 2. OWNER User Sees New Permission

```
OWNER logs in
     ▼
useAuth() returns { userRole: "OWNER", ... }
     ▼
Navbar renders menu items
     ▼
For each item: check if OWNER should see it
     ▼
"POS Billing" check:
  - Is OWNER role included in item.roles? YES ✅
  - Does OWNER have "manage_pos" permission? YES ✅ (admin enabled it)
     ▼
✅ POS Billing link appears in sidebar
     ▼
OWNER clicks POS Billing
     ▼
POSBillingPage loads and renders
```

### 3. SALES_EXECUTIVE Denied Access

```
SALES_EXECUTIVE logs in
     ▼
useAuth() returns { userRole: "SALES_EXECUTIVE", ... }
     ▼
Navbar renders menu items
     ▼
"Reports" check:
  - Is SALES_EXECUTIVE in Reports.roles? NO ❌
  - Does admin allow SALES_EXECUTIVE reports? NO ❌
     ▼
❌ Reports menu item is hidden from sidebar
     ▼
If SALES_EXECUTIVE tries to access /reports directly:
  - ProtectedRoute component checks access
  - Returns "Access Denied"
```

---

## State Management

### PermissionsContext State Structure

```javascript
{
  OWNER: {
    // Dashboard
    "view_dashboard": true,
    
    // Inventory
    "view_inventory": true,
    "manage_inventory": true,
    
    // Customers
    "view_customers": true,
    "manage_customers": true,
    
    // POS (default disabled)
    "view_pos": false,
    "manage_pos": false,
    
    // Reports
    "view_reports": true,
    "manage_reports": true,
    
    // Data
    "export_all": true,
    "import_all": true,
    
    // Admin
    "manage_users": false,
    "view_audit": false
  },
  
  SALES_EXECUTIVE: {
    // Dashboard
    "view_dashboard": true,
    
    // Inventory (view only)
    "view_inventory": true,
    "manage_inventory": false,
    
    // Customers (view only)
    "view_customers": true,
    "manage_customers": false,
    
    // POS (full access)
    "manage_pos": true,
    "view_pos": true,
    
    // Reports (no access)
    "view_reports": false,
    "manage_reports": false,
    
    // Data (export only)
    "export_pos": true,
    "import_all": false,
    
    // Admin
    "manage_users": false,
    "view_audit": false
  }
}
```

### localStorage Persistence

```
Key: "rolePermissions"
Type: JSON string
Location: Browser's local storage
Scope: Per domain (http://localhost:3001)
Lifetime: Until manually cleared or browser cache cleared
Size: ~1-2 KB

Example in DevTools:
┌─ Application
  ├─ Local Storage
    └─ http://localhost:3001
      ├─ currentUser: {"id":"user_123","phone":"+91...","role":"ADMIN"}
      └─ rolePermissions: {"OWNER":{...},"SALES_EXECUTIVE":{...}}
```

---

## Function Reference

### PermissionsContext Methods

```javascript
// 1. Toggle a specific permission
const { togglePermission } = usePermissions();
togglePermission("OWNER", "manage_pos");
// Result: OWNER.manage_pos flips between true/false

// 2. Check if role has permission
const { hasPermission } = usePermissions();
const canManagePOS = hasPermission("OWNER", "manage_pos");
// Result: true or false

// 3. Get all permissions for a role
const { getPermissions } = usePermissions();
const ownerPerms = getPermissions("OWNER");
// Result: { view_dashboard: true, manage_pos: false, ... }

// 4. Reset single role to defaults
const { resetToDefaults } = usePermissions();
resetToDefaults("OWNER");
// Result: OWNER permissions reset to DEFAULT_PERMISSIONS.OWNER

// 5. Reset all roles to defaults
const { resetAllPermissions } = usePermissions();
resetAllPermissions();
// Result: All roles reset to defaults
```

---

## Integration Points

### 1. In App.js

```javascript
import { PermissionsProvider } from "./context/PermissionsContext";

<AuthProvider>
  <PermissionsProvider>  {/* Wraps entire app */}
    <ExportSuccessProvider>
      <NotificationProvider>
        {/* Routes here */}
      </NotificationProvider>
    </ExportSuccessProvider>
  </PermissionsProvider>
</AuthProvider>
```

### 2. In Route Definition

```javascript
<Route path="/admin/control-panel" element={<AdminControlPanel />} />
```

### 3. In Navbar

```javascript
import { usePermissions } from "../context/PermissionsContext";

const { hasPermission } = usePermissions();

// Show control panel link only for ADMIN
{userRole === "ADMIN" && (
  <Link to="/admin/control-panel">
    <Shield /> Control Panel
  </Link>
)}
```

### 4. In Other Pages (Example: POSBillingPage)

```javascript
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";

function POSBillingPage() {
  const { userRole } = useAuth();
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(userRole, "manage_pos")) {
    return <div>Access Denied</div>;
  }
  
  return <POSInterface />;
}
```

---

## Security Layers

```
Layer 1: Component Level
┌─────────────────────────────────┐
│ if (!hasPermission(role, key)) {│
│   return <AccessDenied />       │
│ }                               │
└─────────────────────────────────┘
         ▼ Components check permissions

Layer 2: Route Level (Future Enhancement)
┌─────────────────────────────────┐
│ <ProtectedRoute>                │
│   <AdminControlPanel />          │
│ </ProtectedRoute>               │
└─────────────────────────────────┘
    ▼ Routes enforce role access

Layer 3: UI Level
┌─────────────────────────────────┐
│ Menu items hidden from navbar   │
│ if permission disabled          │
└─────────────────────────────────┘
        ▼ Users don't see disabled features

Layer 4: Backend (Future)
┌─────────────────────────────────┐
│ API endpoints validate          │
│ permissions server-side         │
└─────────────────────────────────┘
  ▼ Server prevents unauthorized access
```

---

## Testing Strategy

### Unit Tests (Future)
```javascript
describe("PermissionsContext", () => {
  test("togglePermission flips boolean", () => {
    // Test that toggle works correctly
  });
  
  test("hasPermission returns correct value", () => {
    // Test permission checking
  });
  
  test("resetToDefaults reverts changes", () => {
    // Test reset functionality
  });
});
```

### Integration Tests (Future)
```javascript
describe("Admin Control Panel", () => {
  test("Admin can toggle permission", () => {
    // Render, click, verify state updates
  });
  
  test("Permission changes persist in localStorage", () => {
    // Toggle, reload, verify still toggled
  });
  
  test("Non-admin cannot access", () => {
    // Login as non-admin, try to access, should see error
  });
});
```

### Manual Testing Checklist
- [ ] Admin can access Control Panel
- [ ] Non-admin sees "Access Denied"
- [ ] Toggling permissions updates checkbox
- [ ] Stats update in real-time
- [ ] Changes persist after page reload
- [ ] Reset to defaults works
- [ ] Confirmation modal appears for reset
- [ ] Other users see feature changes immediately

---

## Performance Considerations

### Optimization Strategies

1. **Memoization** - Use `useMemo` for permission checks
2. **Lazy Loading** - Load permissions only when needed
3. **localStorage Caching** - Avoid repeated JSON.parse/stringify
4. **Debouncing** - Debounce permission toggle saves (if needed)

### Current Implementation
- localStorage reads on component mount
- localStorage writes only when permissions change (automatic)
- useContext causes re-render only when permissions change
- No unnecessary re-renders of unrelated components

---

## Future Roadmap

```
Phase 1: ✅ Core Implementation (CURRENT)
├─ PermissionsContext
├─ Admin Control Panel UI
└─ localStorage persistence

Phase 2: 🔄 Enhancement (NEXT)
├─ Backend API integration
├─ Permission versioning/history
└─ Audit logging

Phase 3: 🚀 Advanced Features
├─ Permission templates
├─ Role inheritance
├─ Time-based permissions
└─ Real-time sync (WebSockets)
```

---

## Troubleshooting Guide

### Debug Steps

```javascript
// In browser console:

// 1. Check if PermissionsContext is loaded
console.log(localStorage.getItem("rolePermissions"));

// 2. Check current user role
console.log(JSON.parse(localStorage.getItem("currentUser")));

// 3. Manually update permission (for testing)
const perms = JSON.parse(localStorage.getItem("rolePermissions"));
perms.OWNER.manage_pos = true;
localStorage.setItem("rolePermissions", JSON.stringify(perms));
location.reload();
```

---

## Summary

The Admin Control Panel implements a **three-tier permission system**:

1. **Local Control** - ADMIN can toggle permissions in UI
2. **State Management** - PermissionsContext stores permissions
3. **Persistence** - localStorage keeps changes across sessions
4. **Consumption** - Components use `usePermissions()` to check access

**Key Features:**
- ✅ No code changes needed
- ✅ Real-time updates
- ✅ Persistent across sessions
- ✅ Admin-only access
- ✅ Easy rollback with reset

**Next Steps:**
- Move to backend database
- Add audit logging
- Implement permission templates
- Real-time sync across devices
