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
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const adminRoute = (req, res, next) => {
    validateToken(req, res, (err) => {
        if (err) return; 
        const user = req.user;
        if (user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not an admin." });
        }
        next();
    });
};

const userRoute = (req, res, next) => {
    validateToken(req, res, (err) => {
        if (err) return; 
        const user = req.user;
        if (user?.role !== "user" && user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not a user." });
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

export { isValidId, adminRoute, userRoute, getUserFromToken };
