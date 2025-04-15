import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function NavButton({ title, link, icon }) {
    return (
        <Box
            component={Link}
            to={link}
            padding={2}
            color={"#000"}
            display={"flex"}
            gap={1}
            sx={{
                textDecoration: "none",
                position: "relative",
                "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "0%",
                    height: "4px",
                    backgroundColor: "#0095e7",
                    transition: "width 0.3s ease",
                },
                "&:hover:after": {
                    width: "100%",
                },
            }}
        >
            <Box>{icon}</Box>
            {title}
        </Box>
    );
}

export default NavButton;
