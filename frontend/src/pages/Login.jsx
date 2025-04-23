import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputAuth from "../components/InputAuth";
import { Box, Button } from "@mui/material";

const initialState = {
    userName: "",
    password: "",
    loading: false,
    error: null,
};

// 2. Reducer xử lý action
function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "LOGIN_START":
            return { ...state, loading: true, error: null };
        case "LOGIN_SUCCESS":
            return { ...state, loading: false };
        case "LOGIN_ERROR":
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}

function Login() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const nav = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userName: state.userName,
                    password: state.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Login failed");

            localStorage.setItem("access_token", JSON.stringify(data.user));
            dispatch({ type: "LOGIN_SUCCESS" });
            console.log(data);
            nav("/");
        } catch (err) {
            dispatch({ type: "LOGIN_ERROR", error: err.message });
        }
    };

    return (
        <Box
            width={"100vw"}
            height={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            bgcolor={"#F5F2E9"}
        >
            <Box
                width={"540px"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                padding={"160px 32px"}
                borderRadius={4}
                bgcolor={"#fff"}
            >
                <Box fontWeight={600} fontSize={"32px"} marginBottom={4}>
                    Login
                </Box>
                <Box marginBottom={5}>
                    Enter your details to get sign in to your account
                </Box>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <InputAuth
                        placeholder={"Input your email"}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "userName",
                                value: e.target.value,
                            })
                        }
                    ></InputAuth>
                    <InputAuth
                        type={"password"}
                        placeholder={"Input your password"}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "password",
                                value: e.target.value,
                            })
                        }
                    ></InputAuth>
                    <Box
                        component={Button}
                        type="submit"
                        bgcolor={"#F8C98C"}
                        color={"#000"}
                        fontWeight={"600"}
                        p={"8px 48px"}
                        maxWidth={"180px"}
                        borderRadius={2}
                        marginTop={4}
                        sx={{ cursor: "pointer" }}
                    >
                        Login
                    </Box>
                </form>
                <Box marginTop={2} fontSize={"12px"}>
                    Don't have an account? <span>Register</span>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;
