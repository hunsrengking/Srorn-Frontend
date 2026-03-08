# Translation Implementation Checklist

## Quick Update Pattern
Every remaining component follows this 3-step process:

```jsx
// Step 1: Add import
import { useTranslation } from "react-i18next";

// Step 2: Add to component function
const { t } = useTranslation();

// Step 3: Replace strings with t() calls
// "Delete Confirm" → t("namespace.delete_confirm")
```

---

## Component Checklist

### Tickets Section
- [ ] **CreateTicket.jsx** - Use `t("tickets.*")` for form labels/buttons
- [ ] **ViewTicket.jsx** - Use `t("tickets.*")` for display

### Users Section
- [ ] **UserCreate.jsx** - Use `t("users.*")` for form
- [ ] **UserEdit.jsx** - Use `t("users.*")`
- [ ] **UserForm.jsx** - Use `t("users.*")`
- [ ] **UserView.jsx** - Use `t("users.*")`

### Settings: Roles
- [ ] **RoleList.jsx** - Use `t("roles.*")`
- [ ] **RoleCreate.jsx** - Use `t("roles.*")`
- [ ] **RolePermission.jsx** - Use `t("roles.*")`

### Settings: Staff
- [ ] **Staff.jsx** - Use `t("staff.*")`
- [ ] **StaffCreate.jsx** - Use `t("staff.*")`
- [ ] **StaffEdit.jsx** - Use `t("staff.*")`
- [ ] **StaffForm.jsx** - Use `t("staff.*")`
- [ ] **ViewStaff.jsx** - Use `t("staff.*")`

### Settings: Other
- [ ] **Positions.jsx** - Use `t("positions.*")`
- [ ] **CreateDepartment.jsx** - Use `t("departments.*")`
- [ ] **DepartmentMember.jsx** - Use `t("departments.*")`
- [ ] **CheckerView.jsx** - Use `t("checker.*")`
- [ ] **Telegram.jsx** - Use `t("telegram.*")`

### Organization
- [ ] **PrintCard.jsx** - Use `t("print_card.*")`
- [ ] **PrintCardNew.jsx** - Use `t("print_card_new.*")`
- [ ] **PrintCardForm.jsx** - Use `t("print_card.*")`
- [ ] **PrintCardEdit.jsx** - Use `t("print_card.*")`

### Students (if exists)
- [ ] **StudentList.jsx** - Use common translation keys
- [ ] **StudentAttendance.jsx** - Use common keys
- [ ] **StudentCard.jsx** - Use common keys

---

## Key-to-Namespace Mapping

Use these prefixes when replacing strings:

| Component | Namespace | Examples |
|-----------|-----------|----------|
| CreateTicket | `tickets.` | `t("tickets.add_new")`, `t("tickets.create_success")` |
| UserCreate | `users.` | `t("users.create_title")`, `t("users.select_role")` |
| RoleCreate | `roles.` | `t("roles.create_title")`, `t("roles.create_success")` |
| Staff* | `staff.` | `t("staff.title")`, `t("staff.add_new")` |
| Positions | `positions.` | `t("positions.title")`, `t("positions.update_success")` |
| Checker | `checker.` | `t("checker.title")`, `t("checker.approve")` |
| Department* | `departments.` | `t("departments.title")`, `t("departments.create_new")` |
| Telegram | `telegram.` | `t("telegram.title")`, `t("telegram.bot_token")` |
| PrintCard | `print_card.` | `t("print_card.title")` |
| Organization | `organization.` | `t("organization.title")` |

---

## Common Strings Used Across Components

These are reusable from `common.*` namespace:

```jsx
t("common.create")      // "Create"
t("common.update")      // "Update"  
t("common.delete")      // "Delete"
t("common.save")        // "Save"
t("common.cancel")      // "Cancel"
t("common.submit")      // "Submit"
t("common.close")       // "Close"
t("common.loading")     // "Loading..."
t("common.processing")  // "Processing..."
t("common.no_data")     // "No data found"
t("common.retry")       // "Retry"
t("common.edit")        // "Edit"
t("common.pending")     // "Pending"
```

---

## Translation Keys by Type

### Titles & Headers
```jsx
t("namespace.title")              // Main page title
t("namespace.description")        // Page description
t("namespace.management")         // Management label
```

### Form Fields
```jsx
t("namespace.field_name")         // "Create User"
t("namespace.placeholder")        // input placeholder
t("namespace.select_role")        // dropdown label
```

### Actions & Buttons
```jsx
t("namespace.add_new")            // "Add New"
t("namespace.create")             // "Create"
t("namespace.update")             // "Update"
t("namespace.delete")             // "Delete"
t("namespace.search_placeholder") // "Search..."
```

### Messages
```jsx
t("namespace.loading")            // "Loading..."
t("namespace.not_found")          // "No X found"
t("namespace.create_success")     // "Created successfully"
t("namespace.create_failed")      // "Failed to create"
t("namespace.delete_confirm")     // Confirmation message
```

---

## Testing Checklist

After updating each component, verify:

- [ ] Component renders without errors
- [ ] English text displays correctly
- [ ] Switch to Khmer - all text changes
- [ ] All form labels translate
- [ ] All buttons translate
- [ ] Error messages translate
- [ ] No hardcoded strings remain
- [ ] Placeholders translate

---

## Validation Script

To find remaining hardcoded strings, search for patterns like:

```bash
# Search for strings that look like they should be translated
grep -r "\"[A-Z][a-zA-Z ]*\"" src/views/

# For specific patterns:
grep -r "placeholder=" src/views/ | grep -v "t("
grep -r "title=" src/views/ | grep -v "t("
```

---

## Quick Reference

### Import Statement (copy-paste)
```jsx
import { useTranslation } from "react-i18next";
```

### Hook Initialization (copy-paste)
```jsx
const MyComponent = () => {
  const { t } = useTranslation();
  // ... rest of component
};
```

### Translation Call Pattern (copy-paste)
```jsx
{t("namespace.key")}
```

---

## Translation Files Location

- **English**: `public/locales/en/translation.json`
- **Khmer**: `public/locales/kh/translation.json`

If adding new keys:
1. Add to both files
2. Keep structure consistent
3. Use same key path in both

---

## Estimated Completion

- **Files to update**: ~20-30 components
- **Time per file**: 5-10 minutes
- **Total time**: 2-4 hours
- **Difficulty**: ⭐ Easy (copy pattern)

---

## Final QA Checklist

- [ ] All text translates to Khmer when language switched
- [ ] No console errors with missing translations
- [ ] Language preference persists (optional: add localStorage)
- [ ] Empty states show translated messages
- [ ] Error/validation messages are translated
- [ ] Confirmation dialogs are translated
- [ ] Success notifications are translated
- [ ] Loading states show translated text

---

**STATUS**: Ready for implementation!  
**NEXT STEP**: Follow the pattern above for each file  
**SUPPORT**: See `TRANSLATION_GUIDE.md` for detailed examples
