import express from "express";
import { getAllSongs, addSong, getSong, deleteSong, getMySongs, getHomeSongs } from "../controllers/song.controller.js";
import { userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get('/songs/', getAllSongs);
router.get('/songs/my', userRoute , getMySongs);
router.get('/songs/home', getHomeSongs);
router.get('/songs/:id', getSong);
router.post('/songs/', userRoute , addSong);
router.delete('/songs/:id', userRoute , deleteSong);

export default router;
