import axiosClient from "@/api/axiosClient";

export const staffService = {
  getStaffs: () => axiosClient.get("/staff"),

  getStaffById: (id) => axiosClient.get(`/staff/${id}`),

  createStaff: (staffData) => axiosClient.post("/staff", staffData),

  updateStaff: (id, staffData) => axiosClient.put(`/staff/${id}`, staffData),

  deleteStaff: (id) => axiosClient.delete(`/staff/${id}`),
};

export default staffService;
