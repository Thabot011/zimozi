import { Modal, Box, Card, CardHeader, CardContent, CardActions, Button, TextField, styled, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, FormGroup, useFormControl } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { category } from "../types/getAllProducts";
import ProductService from "../services/product.Service";
import product from "../types/product";
import { VisuallyHiddenInput, style } from "../shared/Shared";
import { useForm } from "react-hook-form";




const ProductCardComponent = (props: { product?: product, isCreate: boolean, open: boolean, handleClose: () => void }) => {

    const [name, setName] = useState("");
    const [image, setImage] = useState<File>();
    const [price, setPrice] = useState(0);
    const [cat, setCategory] = useState<category | undefined>(0);
    const [stockAvailability, setStockAvailability] = useState<category>(0);
    const CardLabel = props.isCreate ? "Add" : "Edit";
    const { register, handleSubmit, formState: { errors } } = useForm();


    useEffect(() => {
        if (props.product) {
            setName(props.product.name);
            setPrice(props.product.price);
            setCategory(props.product.category);
            setStockAvailability(props.product.stockAvailability)
        }
    }, [props.product])

    const onSubmit = (isCreate: boolean) => {
        let formData: FormData = new FormData();
        let category = cat as category;
        formData.append("name", name);
        formData.append("image", image as Blob);
        formData.append("price", price.toString());
        formData.append("category", category.toString());
        formData.append("stockAvailability", stockAvailability.toString());
        if (props.product) {
            formData.append("imagePath", props.product.imagePath)
        }
        if (!isCreate) {
            formData.append("id", props.product?.id as string);
            ProductService.updateProduct(formData).then(() => {
                props.handleClose();
            });
        }
        else {
            ProductService.addProduct(formData).then(() => {
                props.handleClose();
            });
        }
    }
    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box noValidate autoComplete="off"
                    component="form"
                    onSubmit={handleSubmit((data, event) => {
                        event?.preventDefault();
                        onSubmit(props.isCreate)
                    }, (errors, event) => {
                        event?.preventDefault();
                    })}
                    sx={style}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardHeader>
                            {CardLabel} Product
                        </CardHeader>
                        <CardContent>
                            <FormGroup sx={{ paddingY: 1 }} >
                                <FormControl fullWidth>
                                    <TextField
                                        {...register("name", {
                                            required: "name is required",
                                        })}
                                        id="name"
                                        label="Name"
                                        value={name}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setName(event.target.value);
                                        }}
                                        error={!!errors.name}
                                        helperText={errors.name ? errors.name.message?.toString() : ""}
                                    />
                                </FormControl>
                            </FormGroup>

                            <FormGroup>
                                <FormControl sx={{ paddingY: 1 }} fullWidth>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                    >
                                        Upload product image
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={(event) => {
                                                if (event.target.files && event.target.files.length > 0) {
                                                    const file = event.target.files[0];
                                                    setImage(file);
                                                }
                                            }}
                                        />
                                    </Button>
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl sx={{ paddingY: 1 }} fullWidth>
                                    <TextField
                                        {...register("price", {
                                            required: "price is required",
                                        })}
                                        error={!!errors.price}
                                        helperText={errors.price ? errors.price.message?.toString() : ""}
                                        id="price"
                                        label="Price"
                                        value={price}
                                        type="number"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setPrice(event.target.value as unknown as number);
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl sx={{ paddingY: 1 }} fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        {...register("category", {
                                            required: "category is required",
                                        })}
                                        error={!!errors.category}
                                        labelId="category"
                                        id="category-select"
                                        value={cat?.toString()}
                                        label="Category"
                                        onChange={(event: SelectChangeEvent) => {
                                            setCategory(event.target.value as any);
                                        }}
                                    >
                                        <MenuItem key={category.food} value={category.food}>{category[category.food]}</MenuItem>
                                        <MenuItem key={category.drink} value={category.drink}>{category[category.drink]}</MenuItem>
                                        <MenuItem key={category.clothes} value={category.clothes}>{category[category.clothes]}</MenuItem>
                                    </Select>
                                </FormControl>
                            </FormGroup>
                            <FormGroup sx={{ paddingY: 1 }}>
                                <FormControl fullWidth>
                                    <TextField
                                        {...register("stockAvailability", {
                                            required: "stockAvailability is required",
                                        })}
                                        error={!!errors.stockAvailability}
                                        helperText={errors.stockAvailability ? errors.stockAvailability.message?.toString() : ""}
                                        id="stockAvailability"
                                        label="Stock Availability"
                                        value={stockAvailability}
                                        type="number"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStockAvailability(event.target.value as unknown as number);
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                        </CardContent>
                        <CardActions>
                            <Button type="submit" size="small">{CardLabel}</Button>
                            <Button size="small" onClick={() => props.handleClose()} >Cancel</Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal >
        </>
    );
}
export default ProductCardComponent;