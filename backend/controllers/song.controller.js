import { mongooseErrors } from "../config/errors.js";
import Song from "../models/song.model.js";


const getAllSongs = async (req, res) => {
    try{
        const songs = await Song.find().populate("user").populate("genre");
        res.status(200).json({ success: true, songs });
    }catch(err){
        mongooseErrors(err, res)
    }
}  

const addSong = async (req, res) => {
    try{
        const { title, text, artist, genre } = req.body;
        const song = await Song.create({ title, text, artist, genre });
        res.json({ success: true, song });
    }catch(err){
        mongooseErrors(err, res)
    }
}

export { getAllSongs, addSong };