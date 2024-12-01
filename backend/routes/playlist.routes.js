import express from "express";
import { getAllPlaylists, createPlaylist, getPlaylist, addSongToPlaylists, getMyPlaylists, deletePlaylist, getFavouritePlaylists, likePlaylist, unlikePlaylist, editPlaylist } from "../controllers/playlist.controller.js";
import { userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/playlists/", getAllPlaylists);
router.post("/playlists/", userRoute , createPlaylist);
router.get("/playlists/my-favourite", userRoute, getFavouritePlaylists);
router.get("/playlists/my", userRoute, getMyPlaylists);
router.put("/playlists/:id/like", userRoute, likePlaylist);
router.put("/playlists/:id/unlike", userRoute, unlikePlaylist);
router.put("/playlists/:id/edit", userRoute, editPlaylist);
router.get('/playlists/:id', getPlaylist);
router.delete('/playlists/:id', userRoute , deletePlaylist);
router.post("/add-to-playlist", userRoute, addSongToPlaylists);

export default router;