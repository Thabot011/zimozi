import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, TextareaAutosize } from "@mui/material";
import user from "../types/user";
import ProductComponent from "./ProductComponent";
import { category } from "../types/getAllProducts";
import { useEffect, useState } from "react";
import order, { orderStatus, paymentMethod } from "../types/order";
import orderService from "../services/order.service";
import product from "../types/product";
import cartService from "../services/cart.service";
import cart from "../types/cart";
import { style } from "../shared/Shared";
import { FormEvent } from "react"
import eventBus from "../common/eventBus";
import { useForm } from "react-hook-form";
import ProductService from "../services/product.Service";

const CartComponent = (props: { user?: user, isAdmin: boolean }) => {
    const [userPaymentMethod, setPaymentMethod] = useState<paymentMethod>(0);
    const [shippingAddress, setShippingAddress] = useState("");
    const [offlineCart, setOfflineCart] = useState<cart>();
    const [totalPrice, setTotalPrice] = useState(0);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [products, setProducts] = useState<Array<product>>();


    useEffect(() => {
        if (!props.user) {
            cartService.getCart(false).then((cart: cart) => {
                if (cart) {
                    let totalPrice = cart?.products?.reduce((a, b) => a + b.price, 0);
                    cart.totalPrice = totalPrice;
                    setOfflineCart(cart);
                }
            });
        }
    }, []);

    const removeFromCart = (product: product) => {
        let products: Array<product> = [];
        const stockAvailability = product.stockAvailability += 1;
        if (props.user) {
            products = props.user?.shoppingCart?.products?.filter((x, i, arr) => {
                var index = arr.indexOf(product);
                return i !== index;
            }) as Array<product>;
        } else {
            if (offlineCart) {
                products = offlineCart.products?.filter((x, i, arr) => {
                    var index = arr.indexOf(product);
                    return i !== index;
                }) as Array<product>
                offlineCart.products = products;
            }
        }
        cartService.removeFromCart(props.user ? true : false, props.user ? {
            id: props.user.shoppingCart.id,
            products: products,
            totalPrice: props.user.shoppingCart.totalPrice,
            userId: props.user.id,
            productId: product.id
        } : offlineCart as cart).then((cart: cart) => {
            if (props.user) {
                props.user.shoppingCart = cart;
                eventBus.dispatch("updateUser", props.user);
                eventBus.dispatch("AddtoCart", products.length);
            }
            else {
                let formData: FormData = new FormData();
                let category = product.category;
                formData.append("name", product.name);
                formData.append("image", product.image as Blob);
                formData.append("price", product.price.toString());
                formData.append("category", category.toString());
                formData.append("stockAvailability", stockAvailability.toString());
                formData.append("imagePath", product.imagePath)
                formData.append("id", product.id as string);
                ProductService.updateProduct(formData);
                offlineCart?.products?.forEach((p, i, arr) => {
                    if (p.id == product.id) {
                        p.stockAvailability = stockAvailability;
                    }
                })

                setOfflineCart({ ...offlineCart });
                if (offlineCart?.products) {
                    eventBus.dispatch("AddtoCart", offlineCart.products.length);
                }

            }
        });
    }

    const onSubmit = () => {
        let order: order = {
            id: "",
            orderStatus: orderStatus.pending,
            paymentMethod: userPaymentMethod,
            shippingAddress: shippingAddress,
            productIds: props.user?.shoppingCart?.productIds as Array<string>,
            user: props.user as user
        }
        orderService.addOrder(order).then(() => {
            if (props.user) {
                props.user.shoppingCart = {};
                eventBus.dispatch("updateUser", props.user);
                eventBus.dispatch("AddtoCart", props.user.shoppingCart?.products?.length);
            }
        });
    }


    useEffect(() => {
        let cartProducts = offlineCart ? offlineCart.products : props.user?.shoppingCart?.products;
        let price = offlineCart ? offlineCart?.products?.reduce((a, b) => a + b.price, 0) : props.user?.shoppingCart?.totalPrice;
        setTotalPrice(price as number);
        if (cartProducts) {
            setProducts([...cartProducts as Array<product>]);
        }
        else {
            setProducts([]);
        }
    }, [props.user])

    useEffect(() => {
        let cartProducts = offlineCart?.products;
        let price = offlineCart ? offlineCart?.products?.reduce((a, b) => a + b.price, 0) : props.user?.shoppingCart?.totalPrice;
        setTotalPrice(price as number);
        if (cartProducts) {
            setProducts([...cartProducts as Array<product>])
        }
    }, [offlineCart])

    return (
        <>
            <Box sx={{ maxWidth: "500%" }} noValidate autoComplete="off"
                component="form"
                onSubmit={handleSubmit((data, event) => {
                    event?.preventDefault();
                    onSubmit()
                }, (errors, event) => {
                    event?.preventDefault();
                })}
            >
                <Card>
                    <CardHeader>
                    </CardHeader>
                    <CardContent>
                        <ProductComponent removeFromCart={removeFromCart} isCart={true} products={products} currentUser={props.user} isAdmin={props.isAdmin} ></ProductComponent>

                        <Divider></Divider>
                        <InputLabel >Cart Total price : {totalPrice}</InputLabel>
                        {props.user &&
                            <>

                                <FormControl sx={{ paddingY: 1 }} fullWidth>
                                    <TextField
                                        {...register("shippingAddress", {
                                            required: "shippingAddress is required",
                                        })}
                                        error={!!errors.shippingAddress}
                                        helperText={errors.shippingAddress ? errors.shippingAddress.message?.toString() : ""}
                                        multiline
                                        rows={4}
                                        id="shippingAddress"
                                        label="Shipping Address"
                                        title="Shipping Address"
                                        value={shippingAddress}
                                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            setShippingAddress(event.target.value);
                                        }}
                                    />
                                </FormControl>

                                <FormControl sx={{ paddingY: 1 }} fullWidth>
                                    <InputLabel id="paymentMethod">Payemnt Method</InputLabel>
                                    <Select
                                        {...register("paymentMethod", {
                                            required: "paymentMethod is required",
                                        })}
                                        error={!!errors.paymentMethod}
                                        labelId="paymentMethod"
                                        id="paymentMethod-select"
                                        value={userPaymentMethod.toString()}
                                        label="Payment Method"
                                        onChange={(event: SelectChangeEvent) => {
                                            setPaymentMethod(event.target.value as unknown as paymentMethod);
                                        }}
                                    >
                                        <MenuItem key={paymentMethod.cash} value={paymentMethod.cash}>{paymentMethod[paymentMethod.cash]}</MenuItem>
                                        <MenuItem key={paymentMethod.visa} value={paymentMethod.visa}>{paymentMethod[paymentMethod.visa]}</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        }
                    </CardContent>
                    <CardActions>
                        {props.user && < Button color="info" type="submit" size="small">Checkout</Button>}
                    </CardActions>
                </Card>
            </Box >
        </>
    );
}

export default CartComponent;