import React, { useState, useEffect, FormEvent, use, useLayoutEffect } from "react";
import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthService from "./services/user.service";
import EventBus from "./common/eventBus";
import user, { role } from "./types/user";
import HomeComponent from "./components/HomeComponent";
import LoginComponent from "./components/LoginComponent";
import CartComponent from "./components/CartComponent";
import RegisterComponent from "./components/RegisterComponent";
import OrderComponent from "./components/OrderComponent";
import { Link, Badge, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Drawer, FormControl, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, TextField, Backdrop, CircularProgress, Alert, Snackbar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LogoutIcon from "@mui/icons-material/Logout"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { style } from "./shared/Shared";
import { useForm } from "react-hook-form";
import cartService from "./services/cart.service";
import cart from "./types/cart";


function App() {
    const [currentUser, setCurrentUser] = useState<user>();
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [dOpen, setDOpen] = React.useState(false);
    const [cartIconNumber, setcartIconNumber] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [successAlert, setSuccessAlert] = React.useState(false);
    const [errorAlert, seterrorAlert] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();


    const toggleDrawer = (newOpen: boolean) => () => {
        setDOpen(newOpen);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let user: user | null = AuthService.getCurrentUser();
    const isAdminUser = user?.role == role.admin;
    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            setFullName(user.fullName);
            setIsAdmin(user.role == role.admin)
        }
        if (!user) {
            cartService.getCart(false).then((cart: cart) => {
                if (cart) {
                    setcartIconNumber(cart.products?.length as number);
                }
            });
        }
        setcartIconNumber(user?.shoppingCart?.products?.length as number);

        EventBus.on("login", (user: user) => {
            cartService.getCart(false).then((cart: cart) => {
                if (cart) {
                    cart.userId = user.id;
                    if (user.shoppingCart?.id) {
                        cart.id = user.shoppingCart.id;
                    }
                    cart.isLogin = true;
                    cartService.addToCart(true, cart).then((cartId: string) => {
                        cartService.getCart(true, cartId).then((cart: cart) => {
                            user.shoppingCart = cart;
                            setCurrentUser(user);
                            AuthService.setCurrentUser(user);
                            setcartIconNumber(user?.shoppingCart?.products?.length as number);
                            cartService.removeCartFromLocalStorage();
                        })
                    });

                }
                else {
                    setCurrentUser(user);
                    AuthService.setCurrentUser(user);
                    setcartIconNumber(user?.shoppingCart?.products?.length as number);
                    user = user;
                }
            })
        })

        EventBus.on("AddtoCart", (numberOfProducts: number) => {
            setcartIconNumber(numberOfProducts);
        })

        EventBus.on("AlertSuccess", (success: boolean) => {
            if (success) {
                setSuccessAlert(success);
                seterrorAlert(false);
            }
            else {
                seterrorAlert(true);
                setSuccessAlert(success);
            }
        })

        EventBus.on("showLoading", (showLoading: boolean) => {
            setLoading(showLoading);
        })

        EventBus.on("updateUser", (user: user) => {
            AuthService.setCurrentUser(user);
            setCurrentUser({ ...user });
            setIsAdmin(user.role == role.admin);
        })



        EventBus.on("logout", () => {
            logOut();
        });

        return () => {
            EventBus.remove("logout", undefined);
            EventBus.remove("login", undefined);
            EventBus.remove("updateUser", undefined);
            EventBus.remove("AddtoCart", undefined);
            EventBus.remove("showLoading", undefined);

        };

    }, []);

    const logOut = () => {
        AuthService.logout().then(() => {
            setCurrentUser(undefined);
            user = null;
            setcartIconNumber(0);
            navigate("/");
        });
    };

    const onSubmit = () => {
        if (user) {
            user.fullName = fullName;
            AuthService.updateUser(user).then(() => {
                handleClose();
            });
        }
    }

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <Link href="/">

                    <ListItem key="Zimozi" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>

                            </ListItemIcon>
                            <ListItemText primary="Zimozi" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Divider />
                <Link href="/home">
                    <ListItem key="Home" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>

                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Divider />
                <Link href="/cart">
                    <ListItem key="Cart" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge badgeContent={cartIconNumber} color="secondary">
                                    <ShoppingCartIcon color="secondary" />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Cart" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Divider />
                {user &&
                    <Link href="/orders">
                        <ListItem key="Orders" disablePadding>
                            <ListItemButton>
                                <ListItemIcon>

                                </ListItemIcon>
                                <ListItemText primary="Orders" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                }

                {user ? (
                    <>
                        <Badge onClick={() => { handleOpen() }}>
                            <ListItem key="Profile" disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircleIcon color="info"></AccountCircleIcon>
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                        </Badge>

                        <Badge onClick={() => { EventBus.dispatch("logout", null) }}>
                            <ListItem key="Logout" disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LogoutIcon color="info"></LogoutIcon>
                                    </ListItemIcon>
                                    <ListItemText primary="Logut" />
                                </ListItemButton>
                            </ListItem>
                        </Badge>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <ListItem key="Login" disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>


                                    </ListItemIcon>
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                        <Link href="/register" >

                            <ListItem key="Logout" disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>

                                    </ListItemIcon>
                                    <ListItemText primary="Register" />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                    </>
                )}
            </List>

        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>Menu</Button>
            <Drawer open={dOpen} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>


            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<HomeComponent user={currentUser || user} isAdmin={isAdminUser || isAdmin} />} />
                    <Route path="/home" element={<HomeComponent user={currentUser || user} isAdmin={isAdminUser || isAdmin} />} />
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />
                    <Route path="/orders" element={<OrderComponent user={currentUser || user} isAdmin={isAdminUser || isAdmin} />} />
                    <Route path="/cart" element={<CartComponent user={currentUser || user} isAdmin={isAdminUser || isAdmin} />} />
                </Routes>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box noValidate autoComplete="off"
                    component="form"
                    onSubmit={handleSubmit((data, event) => {
                        event?.preventDefault();
                        onSubmit()
                    }, (errors, event) => {
                        event?.preventDefault();
                    })}
                    sx={style}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardHeader>
                            Update user
                        </CardHeader>
                        <CardContent>
                            <FormControl fullWidth>
                                <TextField
                                    {...register("fullName", {
                                        required: "fullName is required",
                                    })}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName ? errors.fullName.message?.toString() : ""}
                                    id="outlined-controlled"
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setFullName(event.target.value);
                                    }}
                                />
                            </FormControl>
                        </CardContent>
                        <CardActions>
                            <Button type="submit" size="small">Save</Button>
                            <Button size="small" onClick={() => handleClose()} >Cancel</Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar anchorOrigin={{ horizontal: "center", vertical: "top" }} onClose={() => setSuccessAlert(false)} open={successAlert} autoHideDuration={5000} >
                <Alert variant="filled" sx={{ width: '100%' }} severity="success" > Success</Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ horizontal: "center", vertical: "top" }} onClose={() => seterrorAlert(false)} open={errorAlert} autoHideDuration={5000} >
                <Alert variant="filled" sx={{ width: '100%' }} severity="error" > Error</Alert>
            </Snackbar>

        </div >
    );
}

export default App;
