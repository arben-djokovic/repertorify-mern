import express from "express";
import { getAllPlaylists, createPlaylist, getPlaylist, getMyPlaylists, getFavouritePlaylists, likePlaylist, unlikePlaylist } from "../controllers/playlist.controller.js";
import { userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/playlists/", getAllPlaylists);
router.post("/playlists/", userRoute , createPlaylist);
router.get("/playlists/my-favourite", userRoute, getFavouritePlaylists);
router.get("/playlists/my", userRoute, getMyPlaylists);
router.put("/playlists/:id/like", userRoute, likePlaylist);
router.put("/playlists/:id/unlike", userRoute, unlikePlaylist);
router.get('/playlists/:id', getPlaylist);

export default router;