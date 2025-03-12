import baseEntity from "./baseEntity";
import cart from "./cart";
import order from "./order";

export default interface user extends baseEntity {
    fullName: string;
    email: string;
    userId: string;
    role: role;
    token: string;
    shoppingCart: cart;
    orders: Array<order>;

}
export enum role {
    admin,
    normalUser
}