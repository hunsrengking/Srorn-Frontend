# React-i18next Translation Migration Guide

## Overview
All view components have been updated to use `react-i18next` for internationalization with proper namespace prefixes.

## Summary of Updates Completed

### ✅ Completed Files
1. **Dashboard.jsx** - Dashboard statistics and charts with `dashboard.*` keys
2. **Ticket.jsx** - Ticket listing with `tickets.*` keys  
3. **User.jsx** - User management list with `users.*` keys
4. **UserCreate.jsx** - User creation with `users.*` keys
5. **UserEdit.jsx** - User editing with `users.*` keys
6. **Settings.jsx** - Settings home page with `settings.*` keys

### ⏳ Partially Completed
- **CreateTicket.jsx** - Header updated, form labels still need updating
- **UserForm.jsx** - Hook added, labels need updating

### 📋 Pattern for Remaining Files

All remaining files follow this pattern:

```jsx
import { useTranslation } from "react-i18next";

const ComponentName = () => {
  const { t } = useTranslation();
  
  // Use t() for all hardcoded strings:
  // t("namespace.key")
  // t("namespace.key", { parameter: value })
};
```

## Namespace Mapping

| View/Component | Namespace | Example |
|---|---|---|
| Dashboard | `dashboard.*` | `t("dashboard.title")` |
| Tickets | `tickets.*` | `t("tickets.add_new")` |
| Users | `users.*` | `t("users.title")` |
| Settings | `settings.*` | `t("settings.roles_title")` |
| Departments | `departments.*` | `t("departments.title")` |
| Roles | `roles.*` | `t("roles.title")` |
| Staff | `staff.*` | `t("staff.title")` |
| Positions | `positions.*` | `t("positions.title")` |
| Checker/Approval | `checker.*` | `t("checker.title")` |
| Reports | `reports.*` | `t("reports.title")` |
| Organization | `organization.*` | `t("organization.title")` |
| Print Card | `print_card.*` | `t("print_card.title")` |
| Telegram | `telegram.*` | `t("telegram.title")` |
| Common/General | `common.*` | `t("common.create")` |
| Errors | `errors.*` | `t("errors.forbidden_title")` |

## Code Template for Remaining Files

### Step 1: Import Translation Hook
```jsx
import { useTranslation } from "react-i18next";
```

### Step 2: Add Hook to Component
```jsx
const YourComponent = () => {
  const { t } = useTranslation();
  // rest of component
};
```

### Step 3: Replace Hardcoded Strings
**Before:**
```jsx
<h1>Dashboard</h1>
<p>Overview of system performance</p>
<button>Add User</button>
<th>Username</th>
```

**After:**
```jsx
<h1>{t("dashboard.title")}</h1>
<p>{t("dashboard.overview")}</p>
<button>{t("users.add_new")}</button>
<th>{t("users.username")}</th>
```

## Available Translation Keys by Namespace

### Dashboard Keys
- `dashboard.title`
- `dashboard.overview`
- `dashboard.total_tickets`
- `dashboard.ticket_today`
- `dashboard.ticket_pending`
- `dashboard.waiting_approve`
- `dashboard.total_resolved`
- `dashboard.tickets_chart`
- `dashboard.last_7_days`
- `dashboard.by_month`
- `dashboard.no_chart_data`

### Tickets Keys
- `tickets.title`
- `tickets.management`
- `tickets.search_placeholder`
- `tickets.add_new`
- `tickets.id`
- `tickets.title` (column header)
- `tickets.subject`
- `tickets.category`
- `tickets.priority`
- `tickets.status`
- `tickets.assigned_to`
- `tickets.created_at`
- `tickets.start_date`
- `tickets.end_date`
- `tickets.description`
- `tickets.loading`
- `tickets.not_found`
- `tickets.create_success`
- `tickets.create_failed`
- `tickets.delete_confirm`
- `tickets.pagination_showing` (with `{{start}}`, `{{total}}`)
- `tickets.pagination_prev`
- `tickets.pagination_page` (with `{{current}}`, `{{total}}`)
- `tickets.pagination_next`

### Users Keys
- `users.title`
- `users.description`
- `users.search_placeholder`
- `users.add_new`
- `users.username`
- `users.email`
- `users.role`
- `users.department`
- `users.status`
- `users.actions`
- `users.loading`
- `users.load_failed`
- `users.retry`
- `users.not_found`
- `users.delete_confirm`
- `users.edit`
- `users.delete`
- `users.active`
- `users.locked`
- `users.create_title`
- `users.password`
- `users.confirm_password`
- `users.select_role`
- `users.select_staff`
- `users.select_department`
- `users.is_staff`
- `users.create`
- `users.update`
- `users.cancel`
- `users.loading_roles`
- `users.create_success`
- `users.create_failed`

### Settings Keys
- `settings.title`
- `settings.description`
- `settings.roles_title`
- `settings.roles_description`
- `settings.departments_title`
- `settings.departments_description`
- `settings.employees_title`
- `settings.employees_description`
- `settings.positions_title`
- `settings.positions_description`
- `settings.telegram_title`
- `settings.telegram_description`

### Common Keys
- `common.loading`
- `common.create`
- `common.update`
- `common.delete`
- `common.cancel`
- `common.save`
- `common.submit`
- `common.close`
- `common.no_data`
- `common.retry`
- `common.pending`
- `common.processing`
- `common.edit`

## Files Still to Update

The following files still need the translation migration:

1. **CreateTicket.jsx** - Partially done, form labels need updating
2. **ViewTicket.jsx** - Full update needed
3. **UserForm.jsx** - Partially done, labels need updating  
4. **UserView.jsx** - Full update needed
5. **Department.jsx** - Full update needed
6. **CreateDepartment.jsx** - Full update needed
7. **DepartmentMember.jsx** - Full update needed
8. **RoleList.jsx** - Full update needed
9. **RoleCreate.jsx** - Full update needed
10. **RolePermission.jsx** - Full update needed (if exists)
11. **Staff.jsx** - Full update needed
12. **StaffCreate.jsx** - Full update needed
13. **StaffEdit.jsx** - Full update needed
14. **StaffForm.jsx** - Full update needed
15. **ViewStaff.jsx** - Full update needed
16. **Positions.jsx** - Full update needed
17. **Checker.jsx** - Full update needed
18. **CheckerView.jsx** - Full update needed
19. **Report.jsx** - Full update needed
20. **Organization.jsx** - Full update needed
21. **PrintCard.jsx** - Full update needed
22. **PrintCardNew.jsx** - Full update needed
23. **PrintCardForm.jsx** - Full update needed
24. **PrintCardEdit.jsx** - Full update needed
25. **Telegram.jsx** - Full update needed

## Next Steps

For each remaining file:

1. Add `import { useTranslation } from "react-i18next";` at the top
2. Add `const { t } = useTranslation();` in the component function
3. Replace all hardcoded strings with `t("namespace.key")` calls using the appropriate namespace prefix
4. Use interpolation for dynamic values: `t("key", { param1: value1 })`

## Verification

After updating each file:
- Ensure no hardcoded strings remain (except structural text like placeholders for inputs)
- Verify all t() calls use the correct namespace
- Test that text changes when switching languages in the app
- Check for missing translation keys in the console

## Translation Files Location

- English: `/public/locales/en/translation.json`
- Khmer: `/public/locales/kh/translation.json`
- i18n Config: `/src/lang/i18n.js`
