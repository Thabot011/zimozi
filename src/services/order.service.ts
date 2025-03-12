import axios from "axios";
import order from "../types/order";
import { getAllFilter } from "../types/getAllProducts";
import api from "../JWTInterceptor";

const pageSize: number = process.env.REACT_APP_PAGE_SIZE as unknown as number | 10;

const addOrder = (order: order) => {

    return api
        .post("/orders/addOrder", order)
        .then((response) => {
            return response.data;
        });
};


const getOrders = (filter: getAllFilter) => {
    filter.pageSize = pageSize;
    return api
        .post("/orders/getOrders/", filter)
        .then((response) => {
            return response.data;
        });
};


const updateOrder = (order: order) => {
    return api
        .put("/orders/updateOrder/", order)
        .then((response) => {
            return response.data;
        });
};

const orderService = {
    addOrder,
    updateOrder,
    getOrders
}


export default orderService;