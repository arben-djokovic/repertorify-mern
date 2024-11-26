import express from "express";
import { getAllGenres, getOneGenre, addGenre, addMoreGenres , deleteGenre } from "../controllers/genre.controller.js";
import { adminRoute, userRoute } from "../middlewares/middlewares.js";

const router = express.Router();

router.get("/genres/", getAllGenres);
router.get("/genres/:id", userRoute , getOneGenre);
router.post("/genres/", adminRoute , addGenre);
router.post("/genres/more/", adminRoute ,addMoreGenres);
router.delete("/genres/:id", adminRoute , deleteGenre);

export default router;