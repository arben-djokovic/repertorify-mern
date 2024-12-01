import express from "express";
import { getAllUsers, logIn, signUp, changeUsername, changePassword, refreshAccessToken, logOut } from "../controllers/user.controller.js";
import { adminRoute, userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/users/", adminRoute , getAllUsers);
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/auth/refresh", refreshAccessToken)
router.post("/logout", logOut);
router.put("/users/change-username", userRoute , changeUsername);
router.put("/users/change-password", userRoute , changePassword);

export default router;