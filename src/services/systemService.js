import axiosClient from "@/api/axiosClient";

export const systemService = {
  getSystemSettings: () => axiosClient.get("/system-settings"),

  updateSystemSettings: (data) =>
    axiosClient.post("/system-settings", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default systemService;
