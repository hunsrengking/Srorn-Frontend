import axiosClient from "@/api/axiosClient";

export const positionService = {
  getPositions: () => axiosClient.get("/positions"),

  createPosition: (positionData) => axiosClient.post("/positions", positionData),

  updatePosition: (id, positionData) =>
    axiosClient.put(`/positions/${id}`, positionData),

  deletePosition: (id) => axiosClient.delete(`/positions/${id}`),
};

export default positionService;
