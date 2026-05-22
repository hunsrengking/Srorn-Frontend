import axiosClient from "@/api/axiosClient";

export const codeService = {
  getCodes: () => axiosClient.get("/code/"),

  getCodeById: (id) => axiosClient.get(`/code/id/${id}`),

  createCode: (codeData) => axiosClient.post("/code/", codeData),

  updateCode: (id, codeData) => axiosClient.put(`/code/id/${id}`, codeData),

  disableCode: (id) => axiosClient.delete(`/code/id/${id}`),

  enableCode: (id) => axiosClient.put(`/code/id/${id}/enable`),

  getCodeValues: () => axiosClient.get("/code/value/"),

  getCodeValueById: (id) => axiosClient.get(`/code/value/id/${id}`),

  getCodeValuesByCode: (codeName) =>
    axiosClient.get(`/code/value/code/${encodeURIComponent(codeName)}`),

  createCodeValue: (codeValueData) =>
    axiosClient.post("/code/value/", codeValueData),

  updateCodeValue: (id, codeValueData) =>
    axiosClient.put(`/code/value/id/${id}`, codeValueData),

  disableCodeValue: (id) => axiosClient.delete(`/code/value/id/${id}`),

  enableCodeValue: (id) => axiosClient.put(`/code/value/id/${id}/enable`),
};

export default codeService;
