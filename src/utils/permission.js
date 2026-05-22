//src/utill/permission.js
const normalizePermissions = (permissions) => {
  if (!Array.isArray(permissions)) return [];
  return permissions
    .map((permission) =>
      typeof permission === "string" ? permission : permission?.name,
    )
    .filter(Boolean);
};

const normalizeRoleName = (roleName) =>
  (roleName || "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const isPrivilegedRoleName = (roleName) => {
  const normalized = normalizeRoleName(roleName);
  const compact = normalized.replace(/\s+/g, "");
  return normalized === "admin" || normalized === "super admin" || compact === "superadmin";
};

export const isPrivilegedUser = (user) => {
  const role = user?.role;
  const roleName =
    typeof role === "string"
      ? role
      : role?.name || user?.role_name || user?.roleName || "";
  return isPrivilegedRoleName(roleName);
};

export const hasPermission = (perm) => {
  if (!perm) return false;

  try {
    const storedUser = JSON.parse(localStorage.getItem("app_auth_user"));
    if (isPrivilegedUser(storedUser)) return true;

    const rolePerms =
      storedUser?.permissions || storedUser?.role?.permissions || [];
    return normalizePermissions(rolePerms).includes(perm);
  } catch (e) {
    console.error("hasPermission error parsing localStorage", e);
    return false;
  }
};
