import { mongooseErrors } from "../config/errors.js";
import Genre from "../models/genre.model.js";

const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json({success: true, genres });
    } catch (error) {
        mongooseErrors(err, res)
    }
};

const getOneGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findById(id);
        res.json({ success: true, genre });
    } catch (error) {
        mongooseErrors(err, res)
    }
};

const addGenre = async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await Genre.create({ name });
        res.json({ success: true, genre });
    } catch (error) {
        mongooseErrors(err, res)
    }
};

const addMoreGenres = async (req, res) => {
    try {
        const genres = req.body.genres;

        if (!Array.isArray(genres) || genres.length === 0) {
            return res.status(400).json({ message: "Genres must be a non-empty array." });
        }

        const insertedGenres = await Genre.insertMany(genres);
        res.json({ success: true, insertedGenres });
    } catch (error) {
        mongooseErrors(err, res)
    }
};


const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findByIdAndDelete(id);
        res.json({ success: true ,genre });
    } catch (error) {
        mongooseErrors(err, res)
    }
};

export { getAllGenres, addGenre, getOneGenre, deleteGenre, addMoreGenres };