import express from "express";
import { getAllSongs, addSong } from "../controllers/song.controller.js";

const router = express.Router();

router.get('/songs/', getAllSongs);
router.post('/songs/', addSong);

export default router;
