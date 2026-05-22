import axiosClient from "@/api/axiosClient";

export const productService = {
  getProducts: () => axiosClient.get("/products"),

  getProductById: (id) => axiosClient.get(`/products/${id}`),

  createProduct: (productData) => axiosClient.post("/products", productData),

  updateProduct: (id, productData) =>
    axiosClient.put(`/products/${id}`, productData),

  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
};

export default productService;
