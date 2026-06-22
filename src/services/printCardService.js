import axiosClient from "@/api/axiosClient";

export const printCardService = {
  getPrintCards: (params) => axiosClient.get("/organization/printcards", { params }),

  getPrintCardStats: () => axiosClient.get("/organization/printcards/stats"),

  getPrintCardByIdEntity: (id) => axiosClient.get(`/organization/printcards/entity/${id}`),

  getPrintCardById: (id) => axiosClient.get(`/organization/printcards/${id}`),

  createPrintCard: (printCardData) =>
    axiosClient.post("/organization/printcards", printCardData),

  updatePrintCard: (id, printCardData) =>
    axiosClient.put(`/organization/printcards/${id}`, printCardData),

  getPrintCardTemplatesByEntity: (type, id) =>
    axiosClient.get(`/organization/templates/${type}/${id}/printcards`),
};

export default printCardService;
