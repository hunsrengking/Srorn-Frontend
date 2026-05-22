import axiosClient from "@/api/axiosClient";

export const ticketService = {
  getTickets: () => axiosClient.get("/ticket"),

  getWaitingApprovalTickets: () =>
    axiosClient.get("/ticket/status/waitingapprove"),

  getTicketById: (id) => axiosClient.get(`/ticket/${id}`),

  createTicket: (ticketData) => axiosClient.post("/ticket", ticketData),

  updateTicket: (id, ticketData) => axiosClient.patch(`/ticket/${id}`, ticketData),

  approveTicket: (id) => axiosClient.patch(`/ticket/${id}/approve`, null),

  rejectTicket: (id) => axiosClient.patch(`/ticket/${id}/reject`, null),

  updateTicketStatus: (id, action) => axiosClient.patch(`/ticket/${id}/${action}`),

  deleteTicket: (id) => axiosClient.delete(`/ticket/${id}`),

  uploadTicketFile: (formData) =>
    axiosClient.post("/ticket/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default ticketService;
