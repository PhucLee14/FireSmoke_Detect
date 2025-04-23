import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function NavButton({ title, link, icon }) {
    return (
        <Box
            component={Link}
            to={link}
            color={"#000"}
            backgroundColor={"#efefef"}
            fontWeight={"600"}
            padding={2}
            borderRadius={5}
            display={"flex"}
            alignItems={"center"}
            sx={{
                textDecoration: "none",
                "&:hover": {
                    backgroundColor: "#000",
                    color: "#fff",
                },
            }}
        >
            {title}
        </Box>
    );
}

export default NavButton;
