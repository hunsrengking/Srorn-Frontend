import axiosClient from "@/api/axiosClient";

export const reportService = {
  getReports: (params) => axiosClient.get("/reports", { params }),

  exportReports: (params) =>
    axiosClient.get("/reports/export", {
      params,
      responseType: "blob",
    }),
};

export default reportService;
