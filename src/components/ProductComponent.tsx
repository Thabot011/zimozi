import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, InputLabel, Toolbar } from '@mui/material';
import ProductService from '../services/product.Service';
import { useEffect, useState } from 'react';
import product from '../types/product';
import ProductCardComponent from './productCardComponent';
import { paginationModel } from '../shared/Shared';
import getAllProducts, { category } from '../types/getAllProducts';
import user from '../types/user';
import cartService from '../services/cart.service';
import eventBus from '../common/eventBus';
import cart from '../types/cart';
import AuthService from '../services/user.service';








const ProductComponent = (props: { isCart?: boolean, products?: Array<product>, currentUser?: user, isAdmin: boolean, removeFromCart: any }) => {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Array<product>>([]);
    const [totalCount, setTotalCount] = useState<number>();

    const [currentPage, setCurrentPage] = useState(0);
    const [isCreate, setIsCreate] = useState(false);
    const [userFilterModel, setFilterModel] = useState<getAllProducts>();


    const [product, setProduct] = useState<product>();
    const filter: getAllProducts = {};


    const columns: GridColDef<product>[] = [
        {
            field: 'name', headerName: 'Name', width: 130, filterable: false
        },
        {
            field: 'imagePath',
            headerName: 'Image',
            width: 130,
            renderCell: (param) => (
                <Avatar alt="Image" src={process.env.REACT_APP_IMAGE_URL + param.value} sx={{ width: 50, height: 50 }} ></Avatar>
            ),
            filterable: false
        },
        {
            field: 'price',
            headerName: 'Price',
            type: "number",
            width: 130,
            filterable: false
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 130,
            renderCell: (param) => (
                <InputLabel > {category[param.value]} </InputLabel>
            )
        },
        {
            field: 'stockAvailability',
            headerName: 'Stock Availability',
            type: "number",
            width: 130,
            filterable: false
        },
        {
            field: 'priceFrom',
            headerName: '',
            type: "number",
            width: 130,
        }, {
            field: 'priceTo',
            headerName: '',
            type: "number",
            width: 130,
        },
        {
            field: "id",
            width: 300,
            filterable: false,
            headerName: "Actions",
            renderCell: (param) => (


                < div >
                    {props.isAdmin && !props.products &&
                        <>
                            <Button sx={{ paddingY: 1, paddingX: 1 }} color="info" onClick={() => editProduct(param.row)} >Edit</Button>
                            <Button sx={{ paddingY: 1, paddingX: 1 }} color="error" onClick={() => deleteProduct(param.value)} >Delete</Button>
                        </>
                    }
                    {!props.products && param.row.stockAvailability > 0 && !props.isAdmin && < Button sx={{ paddingY: 1, paddingX: 1 }} color="success" onClick={() => AddToCart(param.row)} >Add to cart</Button>}
                    {props.isCart && <Button sx={{ paddingY: 1, paddingX: 1 }} color="error" onClick={() => props.removeFromCart(param.row)} >Remove from Cart</Button>}
                </div >

            )

        }
    ];

    const AddToCart = async (product: product) => {
        cartService.addToCart(props.currentUser ? true : false, props.currentUser ? {
            productIds: [product.id as string],
            userId: props.currentUser?.id,
            id: props.currentUser?.shoppingCart?.id,
            products: [product]
        } : await updateOfflineProduct(product)).then(async (response) => {
            if (response) {
                cartService.getCart(props.currentUser ? true : false, response).then((cart: cart) => {
                    eventBus.dispatch("AddtoCart", cart.products?.length);
                    if (props.currentUser) {
                        props.currentUser.shoppingCart = cart;
                        eventBus.dispatch("updateUser", props.currentUser);
                    }
                })
            } else {
                let cart: cart = await cartService.getCart(false);
                eventBus.dispatch("AddtoCart", cart?.products?.length)
            }
            filter.pageNumber = currentPage;
            getProducts(filter);
        })
    }


    const updateOfflineProduct = async (product: product) => {
        const stockAvailability = product.stockAvailability == 0 ? 0 : product.stockAvailability - 1;
        let formData: FormData = new FormData();
        let category = product.category;
        formData.append("name", product.name);
        formData.append("image", product.image as Blob);
        formData.append("price", product.price.toString());
        formData.append("category", category.toString());
        formData.append("stockAvailability", stockAvailability.toString());
        formData.append("imagePath", product.imagePath)
        formData.append("id", product.id as string);
        await ProductService.updateProduct(formData);
        let cart: cart = {
            productIds: [product.id as string],
            userId: props.currentUser?.id,
            products: [{ ...product, stockAvailability: stockAvailability }],
        }
        return cart;
    }


    useEffect(() => {
        if (props.products) {
            setProducts([...props.products as Array<product>])
        }
    }, [props.products]);

    const handleOpen = (isCreate: boolean) => {
        setIsCreate(isCreate);
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false);
        filter.pageNumber = currentPage;
        getProducts(filter);
    };

    useEffect(() => {
        if (!props.products && !props.isCart) {
            getProducts(filter);
        }
        else {
            setTotalCount(props.products?.length)
        }
    }, []);

    const getProducts = (filter: getAllProducts) => {
        ProductService.getProducts(filter).then(
            (data) => {
                setProducts(data.products);
                setTotalCount(data.totalCount);
            }
        ).then(() => {
        });
    }



    const editProduct = (product: product) => {
        setProduct(product);
        handleOpen(false);
    }

    const deleteProduct = (productId: string) => {
        ProductService.deleteProduct(productId).then(() => {
            getProducts(filter);
            if (props.currentUser) {
                props.currentUser.shoppingCart.products = props.currentUser?.shoppingCart.products?.filter((x) => {
                    return x.id != product;
                });
                eventBus.dispatch("updateUser", props.currentUser);
            }
        })
    }

    return (
        <>
            <Card>
                <CardHeader title="Products">
                </CardHeader>
                <CardContent>
                    <Paper sx={{ height: 400 }}>
                        <DataGrid
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        priceFrom: false,
                                        priceTo: false,
                                    }
                                },
                                pagination: { paginationModel: props.isCart ? undefined : paginationModel }
                            }}
                            rows={products}
                            rowCount={totalCount || undefined}
                            paginationMode={props.isCart ? "client" : "server"}
                            columns={columns}
                            disableColumnSorting
                            sx={{ border: 0 }}
                            filterMode={props.isCart ? "client" : "server"}
                            slots={{ toolbar: props.isCart ? null : GridToolbarFilterButton }}
                            onFilterModelChange={props.isCart ? undefined : (model, details) => {
                                var filterModel: getAllProducts = {
                                    category: model.items.find(x => x.field == "category")?.value as category,
                                    priceFrom: model.items.find(x => x.field == "priceFrom")?.value,
                                    priceTo: model.items.find(x => x.field == "priceTo")?.value,
                                }
                                getProducts(filterModel);
                                setFilterModel(filterModel);
                            }}
                            onPaginationModelChange={props.isCart ? undefined : (model, details) => {
                                if (currentPage > model.page) {
                                    getProducts({
                                        firstDocumentId: products[0].id,
                                        pageNumber: model.page,
                                        category: userFilterModel?.category,
                                        priceFrom: userFilterModel?.priceFrom,
                                        priceTo: userFilterModel?.priceTo
                                    });
                                }
                                else if (model.page > currentPage) {
                                    getProducts({
                                        lastDocumentId: products[products.length - 1].id,
                                        pageNumber: model.page,
                                        category: userFilterModel?.category,
                                        priceFrom: userFilterModel?.priceFrom,
                                        priceTo: userFilterModel?.priceTo
                                    });
                                }
                                setCurrentPage(model.page);
                            }}

                        />
                    </Paper>
                </CardContent>
                <CardActions>
                    {props.isAdmin && !props.products && <Button size="medium" color="info" onClick={() => handleOpen(true)} >Add Product</Button>}
                </CardActions>
            </Card>
            {!props.products && <ProductCardComponent open={open} product={product} handleClose={() => handleClose()} isCreate={isCreate} ></ProductCardComponent>}
        </>
    );

};



export default ProductComponent;


