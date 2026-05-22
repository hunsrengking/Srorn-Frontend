import axiosClient from "@/api/axiosClient";

export const officeService = {
  getOffices: () => axiosClient.get("/offices"),

  getOfficeById: (id) => axiosClient.get(`/offices/${id}`),

  createOffice: (officeData) => axiosClient.post("/offices", officeData),

  updateOffice: (id, officeData) => axiosClient.put(`/offices/${id}`, officeData),

  deleteOffice: (id) => axiosClient.delete(`/offices/${id}`),
};

export default officeService;
