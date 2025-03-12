import { Box, Card, CardHeader, CardContent, FormControl, TextField, Button, InputLabel, Select, SelectChangeEvent, MenuItem, CardActions } from "@mui/material";
import { FormEvent, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google"
import AuthService from "../services/user.service";
import { style } from "../shared/Shared";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginComponent = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = () => {
        AuthService.login(email, password).then(() => {
            navigate("/");
        });
    }
    return (
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
                    Login
                </CardHeader>
                <CardContent>
                    <FormControl sx={{ paddingY: 1 }} fullWidth>
                        <TextField
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message?.toString() : ""}
                            id="outlined-controlled"
                            label="Email"
                            value={email}
                            type="email"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ paddingY: 1 }} fullWidth>
                        <TextField
                            {...register("password", {
                                required: "password is required",
                            })}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message?.toString() : ""}
                            id="outlined-controlled"
                            label="Password"
                            value={password}
                            type="password"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </FormControl>
                </CardContent>
                <CardActions>
                    <Button color="info" type="submit" size="small">Login</Button>
                    <Button size="small" onClick={() => {
                        AuthService.userGoogleSignIn();
                        navigate("/");
                    }} startIcon={<GoogleIcon ></GoogleIcon>} >Google Sign In</Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default LoginComponent;