import express from "express";
import { getAllSongs, addSong, getSong, deleteSong, getTopByArtists, deleteAllSongsFromUser, getUserSongs, getArtists, getHomeSongs, downloadSong, editSong, changeStepToSong } from "../controllers/song.controller.js";
import { userRoute, adminRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get('/songs/', getAllSongs);
router.get('/songs/user/:id', getUserSongs);
router.get('/songs/home', getHomeSongs);
router.get('/songs/:id', getSong);
router.get('/playlists/:playlistId/songs/:id', getSong);
router.post('/songs/', userRoute , addSong);
router.delete('/songs/:id', userRoute , deleteSong);
router.put("/songs/:id/edit", userRoute , editSong);
router.get("/download/songs/:id", downloadSong);
router.get('/artists/:letter', getArtists);
router.get('/songs/top-five/:songId', getTopByArtists);
router.put('/songs/:id/step', userRoute , changeStepToSong);
router.delete('/songs/user/:id', adminRoute , deleteAllSongsFromUser);

export default router;
