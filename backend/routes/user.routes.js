import express from "express";
import { getAllUsers, logIn, signUp } from "../controllers/user.controller.js";
import { adminRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/users/", adminRoute , getAllUsers);
router.post("/signup", signUp);
router.post("/login", logIn);

export default router;