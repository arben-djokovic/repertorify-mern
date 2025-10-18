import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";

const isValidId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: "Invalid id" });
    }
    next();
};

const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        // return error that can be caught in this function
        return next(new Error("You are not logged in."));
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.warn("Invalid token:", error.message);
        next();
    }
};

const adminRoute = (req, res, next) => {
    validateToken(req, res, (err) => {
        if (err) return res.status(403).json({ success: false, message: "You are not logged in." }); 
        const user = req.user;
        if (user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not a admin." });
        }
        next();
    });
};

const userRoute = (req, res, next) => {
    validateToken(req, res, (err) => {
        if (err) return res.status(403).json({ success: false, message: "You are not logged in." }); 
        const user = req.user;
        if (user?.role !== "user" && user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not a user." });
        }else if (user.isBlocked) {
            return res.status(403).json({ success: false, message: "You are blocked." });
        }
        next();
    });
};

const getUserFromToken = (req) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken
    } catch (error) {
        return null
    }
}

export { isValidId, adminRoute, userRoute, getUserFromToken, validateToken };
