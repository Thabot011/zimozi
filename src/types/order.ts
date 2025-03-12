import baseEntity from "./baseEntity";
import product from "./product";
import user from "./user";

export default interface order extends baseEntity {
    shippingAddress: string;
    paymentMethod: paymentMethod;
    orderStatus: orderStatus;
    productIds: Array<string>;
    user: user;
}
export enum paymentMethod {
    cash,
    visa
}

export enum orderStatus {
    pending,
    shipped,
    delivered
}