import axiosClient from "@/api/axiosClient";

export const printCardService = {
  getPrintCards: () => axiosClient.get("/organization/printcards"),

  getPrintCardById: (id) => axiosClient.get(`/organization/printcards/${id}`),

  createPrintCard: (printCardData) =>
    axiosClient.post("/organization/printcards", printCardData),

  updatePrintCard: (id, printCardData) =>
    axiosClient.put(`/organization/printcards/${id}`, printCardData),

  getPrintCardTemplates: () =>
    axiosClient.get("/organization/templates/printcards"),
};

export default printCardService;
