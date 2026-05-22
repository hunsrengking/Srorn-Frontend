import axiosClient from "@/api/axiosClient";

export const roleService = {
  getRoles: () => axiosClient.get("/role"),

  getRoleById: (id) => axiosClient.get(`/role/${id}`),

  createRole: (roleData) => axiosClient.post("/role", roleData),

  deleteRole: (id) => axiosClient.delete(`/role/${id}`),

  updateRolePermissions: (id, permissionData) =>
    axiosClient.put(`/role/${id}/permissions`, permissionData),
};

export default roleService;
