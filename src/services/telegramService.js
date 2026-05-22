import axiosClient from "@/api/axiosClient";

export const telegramService = {
  getTelegramConfigs: () => axiosClient.get("/telegram"),

  createTelegramConfig: (telegramData) =>
    axiosClient.post("/telegram", telegramData),

  updateTelegramConfig: (id, telegramData) =>
    axiosClient.put(`/telegram/${id}`, telegramData),

  deleteTelegramConfig: (id) => axiosClient.delete(`/telegram/${id}`),
};

export default telegramService;
