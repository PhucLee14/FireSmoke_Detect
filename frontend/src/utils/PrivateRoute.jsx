import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const checkExpiration = () => {
        const expiresAt = localStorage.getItem("expiresAt");
        if (expiresAt) {
            const now = new Date().getTime();
            if (now > parseInt(expiresAt)) {
                localStorage.removeItem("access_token");
            }
        }
    };

    checkExpiration();
    const token = localStorage.getItem("access_token");

    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
