import axios from "axios";
import cart from "../types/cart";
import { json } from "stream/consumers";
import product from "../types/product";
import api from "../JWTInterceptor";

const cartKey = "-Cart";

const addToCart = async (isLoggedIn: boolean, cart: cart) => {
    if (!isLoggedIn) {
        await handleLocalStorageCart(cart);
    }
    else {
        return api
            .post("/shoppingCart/addProductToCart", cart)
            .then((response) => {
                return response.data;
            });
    }
};




const removeFromCart = async (isLoggedIn: boolean, cart: cart) => {
    if (!isLoggedIn) {
        await removeFromLocalStorage(cart);
    }
    else {
        return api
            .post("/shoppingCart/removeProductFromCart", cart)
            .then((response) => {
                return response.data;
            });
    }
};


const getCart = async (isLoggedIn: boolean, cartId?: string) => {
    if (!isLoggedIn) {
        return await getUserLocalStorageCart()
    }
    else {
        let respnse = await api
            .get("/shoppingCart/getShoppingCart/" + cartId);
        return respnse.data;
    }
};

const removeCartFromLocalStorage = async () => {
    let clientIp = await getUserClientIp();
    const userCartKey = clientIp + cartKey;
    localStorage.removeItem(userCartKey);
}

const handleLocalStorageCart = async (cart: cart) => {
    let clientIp = await getUserClientIp();
    const userCartKey = clientIp + cartKey;
    if (localStorage.getItem(userCartKey)) {
        let userCart = JSON.parse(localStorage.getItem(userCartKey) as string) as cart;
        userCart.productIds = [...userCart.productIds as Array<string>, ...cart.productIds as Array<string>];
        userCart.products = [...userCart.products as Array<product>, ...cart.products as Array<product>];
        localStorage.setItem(userCartKey, JSON.stringify(userCart));
    }
    else {
        localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
    return Promise.resolve();
}

const removeFromLocalStorage = async (cart: cart) => {
    let clientIp = await getUserClientIp();
    const userCartKey = clientIp + cartKey;
    if (localStorage.getItem(userCartKey)) {
        let userCart = JSON.parse(localStorage.getItem(userCartKey) as string) as cart;
        userCart.products = [...cart.products as Array<product>];
        localStorage.setItem(userCartKey, JSON.stringify(userCart));
    }

}

const getUserLocalStorageCart = async () => {
    let clientIp = await getUserClientIp();
    const userCartKey = clientIp + cartKey;
    if (localStorage.getItem(userCartKey)) {
        return JSON.parse(localStorage.getItem(userCartKey) as string) as cart;
    }
}

const getUserClientIp = async () => {
    let response = await api.get("https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.REACT_APP_IP_API_Key);
    return response.data.ip;
}


const cartService = {
    addToCart,
    removeFromCart,
    getCart,
    removeCartFromLocalStorage
}

export default cartService;
