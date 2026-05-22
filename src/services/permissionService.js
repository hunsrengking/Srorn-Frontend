import axiosClient from "@/api/axiosClient";

export const permissionService = {
  getPermissions: () => axiosClient.get("/permissions"),
};

export default permissionService;
