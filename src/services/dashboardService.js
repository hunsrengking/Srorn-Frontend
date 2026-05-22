import axiosClient from "@/api/axiosClient";

export const dashboardService = {
  getSummary: () => axiosClient.get("/dashboard/summary"),

  getTicketsByDate: () => axiosClient.get("/dashboard/ticketsbydate"),

  getTicketsByMonth: () => axiosClient.get("/dashboard/ticketsbymonth"),
};

export default dashboardService;
