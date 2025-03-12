import { getAllFilter } from "./getAllProducts";

export default interface getAllOrders extends getAllFilter {
    userId?: string;
}