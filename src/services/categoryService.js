import axiosClient from "@/api/axiosClient";

export const categoryService = {
  getCategories: () => axiosClient.get("/category"),
};

export default categoryService;
