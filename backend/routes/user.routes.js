import express from "express";
import { getAllUsers, logIn, signUp, changeUsername, unblockUser, blockUser, getUser, changePassword, refreshAccessToken, logOut } from "../controllers/user.controller.js";
import { adminRoute, userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/users/", adminRoute , getAllUsers);
router.get("/users/:id", getUser);
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/auth/refresh", refreshAccessToken)
router.post("/logout", logOut);
router.put("/users/change-username", userRoute , changeUsername);
router.put("/users/change-password", userRoute , changePassword);
router.put("/users/block/:id", adminRoute , blockUser);
router.put("/users/unblock/:id", adminRoute , unblockUser);

export default router;