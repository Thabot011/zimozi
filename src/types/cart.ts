import product from "./product";
import baseEntity from "./baseEntity";

export default interface cart extends baseEntity {
    totalPrice?: number;
    userId?: string;
    productIds?: Array<string>;
    products?: Array<product>;
    productId?: string;
    isLogin?: boolean;
}