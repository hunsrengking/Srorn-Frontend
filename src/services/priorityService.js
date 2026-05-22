import axiosClient from "@/api/axiosClient";

export const priorityService = {
  getPriorities: () => axiosClient.get("/priority"),
};

export default priorityService;
