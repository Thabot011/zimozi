import { Box, Card, CardHeader, CardContent, FormControl, TextField, CardActions, Button, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FormEvent, useState } from "react";
import AuthService from "../services/user.service";
import { role } from "../types/user";
import { style } from "../shared/Shared";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const RegisterComponent = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userRole, setRole] = useState<role>(1);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = () => {
        AuthService.register(fullName, email, password, confirmPassword, userRole).then(() => {
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
                            {...register("fullName", {
                                required: "fullName is required",
                            })}
                            label="Full Name"
                            value={fullName}
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFullName(event.target.value);
                            }}
                            error={!!errors.fullName}
                            helperText={errors.fullName ? errors.fullName.message?.toString() : ""}
                        />
                    </FormControl>
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
                            label="Password"
                            value={password}
                            type="password"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ paddingY: 1 }} fullWidth>
                        <TextField
                            {...register("confirmPassword", {
                                required: "confirmPassword is required",
                                validate: (v) => {
                                    return v === password || "The passwords do not match"
                                }
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword ? errors.confirmPassword.message?.toString() : ""}
                            label="Confirm Password"
                            value={confirmPassword}
                            type="password"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setConfirmPassword(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ paddingY: 1 }} fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            {...register("userRole", {
                                required: "userRole is required",
                            })}
                            error={!!errors.userRole}
                            value={userRole?.toString()}
                            label="Role"
                            onChange={(event: SelectChangeEvent) => {
                                setRole(event.target.value as unknown as role);
                            }}
                        >
                            <MenuItem value={role.admin}>{role[role.admin]}</MenuItem>
                            <MenuItem value={role.normalUser}>{role[role.normalUser]}</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
                <CardActions>
                    <Button color="info" type="submit" size="small">Register</Button>
                </CardActions>
            </Card>
        </Box>
    );
}
export default RegisterComponent;