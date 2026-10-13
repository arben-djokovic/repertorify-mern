import express from "express";
import rateLimit from "express-rate-limit";
import { getAllUsers, logIn, signUp, changeUsername, unblockUser, blockUser, getUser, changePassword, refreshAccessToken, logOut } from "../controllers/user.controller.js";
import { adminRoute, userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.get("/users/", adminRoute , getAllUsers);
router.get("/users/:id", getUser);
router.post("/signup", authLimiter, signUp);
router.post("/login", authLimiter, logIn);
router.post("/auth/refresh", refreshAccessToken)
router.post("/logout", logOut);
router.put("/users/change-username", userRoute , changeUsername);
router.put("/users/change-password", userRoute , changePassword);
router.put("/users/block/:id", adminRoute , blockUser);
router.put("/users/unblock/:id", adminRoute , unblockUser);

export default router;