import axios from "axios";
import getAllProducts from "../types/getAllProducts";
import api from "../JWTInterceptor";
const pageSize: number = process.env.REACT_APP_PAGE_SIZE as unknown as number | 10;
const getProducts = (filter: getAllProducts) => {
    filter.pageSize = pageSize;
    return api
        .post("/products/GetAllproducts", filter)
        .then((response) => {
            return response.data;
        });
};

const addProduct = (product: FormData) => {
    return api
        .post("/products/addProduct", product)
        .then((response) => {
            return response.data;
        });
};

const updateProduct = (product: FormData) => {
    return api
        .put("/products/updateProduct", product)
        .then((response) => {
            return response.data;
        });
};

const deleteProduct = (productId: string) => {
    return api
        .delete("/products/deleteProduct/" + productId)
        .then((response) => {
            return response.data;
        });
};

const getProduct = (productId: string) => {
    return api
        .get("/products/updateProduct/" + productId)
        .then((response) => {
            return response.data;
        });
};

const ProductService = {
    getProducts,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct
}

export default ProductService;
