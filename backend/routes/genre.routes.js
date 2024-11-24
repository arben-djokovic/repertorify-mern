import express from "express";
import { getAllGenres, getOneGenre, addGenre, addMoreGenres , deleteGenre } from "../controllers/genre.controller.js";

const router = express.Router();

router.get("/genres/", getAllGenres);
router.get("/genres/:id", getOneGenre);
router.post("/genres/", addGenre);
router.post("/genres/more/", addMoreGenres);
router.delete("/genres/:id", deleteGenre);

export default router;