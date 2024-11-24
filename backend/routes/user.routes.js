import express from "express";
import { getAllUsers, logIn, signUp } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users/", getAllUsers);
router.post("/signup", signUp);
router.post("/login", logIn);

export default router;