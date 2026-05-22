import axiosClient from "@/api/axiosClient";

export const assetService = {
  getAssets: () => axiosClient.get("/assets"),

  getAssetById: (id) => axiosClient.get(`/assets/${id}`),

  createAsset: (assetData) => axiosClient.post("/assets", assetData),

  updateAsset: (id, assetData) => axiosClient.put(`/assets/${id}`, assetData),

  deleteAsset: (id) => axiosClient.delete(`/assets/${id}`),
};

export default assetService;
