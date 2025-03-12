import { useState, useEffect } from "react";
import ProductService from "../services/product.Service";
import getAllProducts from "../types/getAllProducts";
import { Button } from "@mui/material";
import product from "../types/product";
import ProductComponent from "./ProductComponent";
import ProductCardComponent from "./productCardComponent";
import user from "../types/user";





const HomeComponent = (props: { user?: user, isAdmin: boolean }) => {


    return (
        <div className="container">
            <header className="jumbotron">
                {props.user && "Welcome " + props.user.fullName}
            </header>
            <ProductComponent removeFromCart={undefined} isCart={false} currentUser={props.user} isAdmin={props.isAdmin} ></ProductComponent>
        </div>
    );
};

export default HomeComponent;