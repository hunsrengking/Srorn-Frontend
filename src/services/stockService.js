import axiosClient from "@/api/axiosClient";

export const stockService = {
  getStocks: () => axiosClient.get("/stocks"),

  adjustStock: (stockData) => axiosClient.post("/stocks/adjust", stockData),
};

export default stockService;
