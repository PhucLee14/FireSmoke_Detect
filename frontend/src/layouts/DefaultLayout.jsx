import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import NavButton from "../components/NavButton";

function DefaultLayout({ children }) {
    const user = JSON.parse(localStorage.getItem("access_token"));
    return (
        user && (
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
            >
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={"100%"}
                    height={"60px"}
                    borderBottom={"1px solid #ccc"}
                    position={"fixed"}
                    backgroundColor={"#fff"}
                >
                    <Box
                        component={Link}
                        to={"/"}
                        marginRight={"16px"}
                        sx={{
                            padding: "20px",
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "block",
                        }}
                    >
                        Fire Detection
                    </Box>
                    <Box
                        display={"flex"}
                        margin={"0px 16px"}
                        height={"40px"}
                        gap={2}
                    >
                        <NavButton title={"Home"} link={"/"} />
                        <NavButton title={"Dashboard"} link={"/dashboard"} />
                    </Box>
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        marginRight={"16px"}
                    >
                        {user ? (
                            <Box fontWeight={600} fontSize={"14px"}>
                                {user.fullName}
                            </Box>
                        ) : (
                            ""
                        )}
                        <Box
                            fontWeight={600}
                            fontSize={"14px"}
                            bgcolor={"#efefef"}
                            p={"12px 16px"}
                            borderRadius={5}
                            ml={2}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "#000",
                                    color: "#fff",
                                },
                            }}
                            onClick={() => {
                                localStorage.removeItem("access_token");
                                window.location.href = "/login";
                            }}
                        >
                            Logout
                        </Box>
                    </Box>
                </Box>
                <Box width={"calc(100vw - 240px)"} marginTop={"60px"}>
                    {children}
                </Box>
            </Box>
        )
    );
}

export default DefaultLayout;
