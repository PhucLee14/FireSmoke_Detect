import { Input } from "@mui/material";
import React, { useState } from "react";

function InputAuth({ type, placeholder, onChange }) {
    const [borderFocus, setBorderFocus] = useState(false);

    return (
        <Input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            disableUnderline
            onFocus={() => setBorderFocus(true)}
            onBlur={() => setBorderFocus(false)}
            sx={{
                py: 1,
                px: 1.5,
                width: "100%",
                backgroundColor: "#ffffff",
                fontSize: "0.875rem",
                marginBottom: 1.5,
                borderBottom: borderFocus
                    ? "2px solid #F8C98C"
                    : "1px solid #ccc",
                "& .MuiInputBase-input": {
                    py: 0.8,
                    backgroundColor: "transparent",
                },
            }}
        />
    );
}

export default InputAuth;
