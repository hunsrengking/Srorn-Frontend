import axiosClient from "@/api/axiosClient";

export const reportService = {
  getReports: (params) => axiosClient.get("/reports/ticket", { params }),

  exportReports: (params) =>
    axiosClient.get("/reports/ticket/export", {
      params,
      responseType: "blob",
    }),
};

export default reportService;
