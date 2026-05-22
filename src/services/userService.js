import axiosClient from "@/api/axiosClient";

export const userService = {
  getUsers: () => axiosClient.get("/users"),

  getUsersWithoutDepartment: () => axiosClient.get("/users/without/departmemt"),

  getUser: (id) => axiosClient.get(`/users/${id}`),

  createUser: (userData) => axiosClient.post("/users", userData),

  updateUser: (id, userData) => axiosClient.put(`/users/${id}`, userData),

  deleteUser: (id) => axiosClient.delete(`/users/${id}`),

  changePassword: (id, passwordData) =>
    axiosClient.patch(`/users/${id}/change-password`, passwordData),
};

export default userService;
