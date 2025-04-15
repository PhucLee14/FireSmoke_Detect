import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import NavButton from "../components/NavButton";

function DefaultLayout({ children }) {
    return (
        <Box display={"flex"}>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"180px"}
                height={"100vh"}
                borderRight={"1px solid #ccc"}
            >
                <Box>
                    <Box
                        component={Link}
                        to={"/"}
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
                    <Box display={"flex"} flexDirection={"column"}>
                        <NavButton
                            title={"Home"}
                            link={"/"}
                            icon={<i class="fa-regular fa-house fa-lg"></i>}
                        />
                        <NavButton
                            title={"Dashboard"}
                            link={"/dashboard"}
                            icon={
                                <i class="fa-regular fa-table-list fa-lg"></i>
                            }
                        />
                    </Box>
                </Box>
                <Box>Login</Box>
            </Box>
            <Box width={"calc(100vw - 180px)"}>{children}</Box>
        </Box>
    );
}

export default DefaultLayout;
