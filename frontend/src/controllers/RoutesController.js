import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useToken from "./TokenController";


export const AdminRoute = ({ children }) => {
    const { getDecodedToken } = useToken()
    const decodedToken = getDecodedToken();

    if (!decodedToken) {
        toast.error("You are not logged in.");
        return <Navigate to="/login" replace />;
    }

    if (decodedToken.role !== "admin") {
        toast.error("You are not an admin.");
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export const UserRoute = ({ children }) => {
    const { isAuthenticated } = useToken()
    if (!isAuthenticated()) {
        toast.error("You are not logged in.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const GuestRoute = ({ children }) => {
    const { isAuthenticated } = useToken()
    if (isAuthenticated()) {
        toast.error("You are already logged in.");
        return <Navigate to="/" replace />;
    }

    return children;
};