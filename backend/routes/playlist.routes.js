import express from "express";
import { getAllPlaylists } from "../controllers/playlist.controller.js";

const router = express.Router();

router.get("/playlists/", getAllPlaylists);

export default router;