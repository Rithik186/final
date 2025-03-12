import API from "./api.js";

export const addProduct = async (productData) => {
  const response = await API.post("/addprod", productData);
  return response.data;
};

export const getProducts = async () => {
  const response = await API.get("/");
  return response.data;
};

export const getFarmerProducts = async () => {
  const response = await API.get("/products/farmerproduct");
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/product/updateproduct/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/product/remproduct/${id}`);
  return response.data;
};
