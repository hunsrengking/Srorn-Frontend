import axiosClient from "@/api/axiosClient";

export const statusService = {
  getStatuses: () => axiosClient.get("/status"),
};

export default statusService;
