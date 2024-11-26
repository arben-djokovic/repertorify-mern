import express from "express";
import { getAllPlaylists, createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";
import { userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/playlists/", getAllPlaylists);
router.post("/playlists/", userRoute , createPlaylist);
router.get('/playlists/:id', getPlaylist);

export default router;