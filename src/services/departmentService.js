import axiosClient from "@/api/axiosClient";

export const departmentService = {
  getDepartments: () => axiosClient.get("/department"),

  getDepartmentById: (id) => axiosClient.get(`/department/${id}`),

  createDepartment: (departmentData) =>
    axiosClient.post("/department", departmentData),

  deleteDepartment: (id) => axiosClient.delete(`/department/${id}`),

  addMember: (departmentId, userId) =>
    axiosClient.post(`/department/${departmentId}/members/add`, { userId }),

  removeMember: (departmentId, userId) =>
    axiosClient.delete(`/department/${departmentId}/members/${userId}remove`),
};

export default departmentService;
