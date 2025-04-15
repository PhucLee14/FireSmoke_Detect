import { Box, CircularProgress } from "@mui/material";
import React from "react";

function LoadingCircle() {
    return (
        <Box
            position={"absolute"}
            top="0"
            left="0"
            display={"flex"}
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            bgcolor="rgba(0, 0, 0, 0.3)"
            zIndex={999}
        >
            <CircularProgress />
        </Box>
    );
}

export default LoadingCircle;
