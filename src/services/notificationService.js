import axiosClient from "@/api/axiosClient";

export const notificationService = {
  getNotifications: () => axiosClient.get("/notifications"),

  markAsRead: (id) => axiosClient.put(`/notifications/${id}/read`),
};

export default notificationService;
