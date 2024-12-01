import { mongooseErrors } from "../config/errors.js";
import Song from "../models/song.model.js";
import { SONGS_PER_PAGE } from "../config/index.js";

const songsPerLoad = SONGS_PER_PAGE;

const getAllSongs = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = page * songsPerLoad;
        const genre = req.query.genre || null; 
        const search = req.query.search || "";
        
        const query = { };

        if (genre) {
            query.genre = genre;
        }

        if (search) {
            query.$or = [
                { title: { $regex: String(search), $options: "i" } },
                { artist: { $regex: String(search), $options: "i" } },
                { text: { $regex: String(search), $options: "i" } },
            ];
        }

        console.log(search)
        const songs = await Song.find(query)
            .populate("user")
            .populate("genre")
            .limit(limit);
        
        const totalSongs = await Song.countDocuments(query);
        res.status(200).json({ success: true, songs, hasMore: totalSongs > limit });
    }catch(err){
        mongooseErrors(err, res)
    }
}  

const addSong = async (req, res) => {
    try{
        const { title, text, artist, genre, user } = req.body;
        const song = await Song.create({ title, text, artist, genre, user });
        res.json({ success: true, song });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const getSong = async (req, res) => {
    try{
        const { id } = req.params;
        const song = await Song.findById(id).populate("user").populate("genre");
        if(!song) return res.status(404).json({ success: false, message: "Song not found" });
        res.json({ success: true, song });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const getHomeSongs = async (req, res) => {
    try{
        const songs = await Song.find().populate("user").populate("genre").limit(7);
        res.json({ success: true, songs });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        if (song.user.toString() === userId.toString() || userRole === "admin") {
            await Song.findByIdAndDelete(id);
            return res.json({ success: true, message: "Song deleted successfully", song });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this song" });
        }
    } catch (err) {
        mongooseErrors(err, res);
    }
};

const getMySongs = async (req, res) => {
    try{
        const userId = req.user._id;
        const songs = await Song.find({ user: userId }).populate("user").populate("genre");
        res.json({ success: true, songs});
    }catch(err){
        mongooseErrors(err, res)
    }
}

const editSong = async (req, res) => {
    const { id } = req.params;
    const { title, text, artist, genre } = req.body;
    try{
        const song = await Song.findById(id).populate("user");
        if(!song) return res.status(404).json({ success: false, message: "Song not found" });
        if(song.user.id !== req.user._id && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Unauthorized to edit this song" }); 
        song.title = title;
        song.text = text;
        song.artist = artist;
        song.genre = genre;
        await song.save();
        res.json({ success: true, song });
    }catch(err){
        mongooseErrors(err, res)
    }
}
export { getAllSongs, addSong, getSong, deleteSong, getMySongs, getHomeSongs, editSong };