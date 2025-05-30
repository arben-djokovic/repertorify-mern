import { mongooseErrors } from "../config/errors.js";
import Song from "../models/song.model.js";
import Playlist from "../models/playlist.model.js";
import { SONGS_PER_PAGE } from "../config/index.js";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from 'url';
import { createDiacriticRegex } from "../config/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const songsPerLoad = SONGS_PER_PAGE;


const getAllSongs = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = page * songsPerLoad;
        const genre = req.query.genre || ""; 
        const search = req.query.search || "";
        const artist = req.query.artist || "";
        
        const query = { };

        if (genre) {
            query.genre = genre;
        }
        if (artist) {
            const artistRegex = createDiacriticRegex(artist);
            query.artist = { $regex: String(artistRegex), $options: "i" };
        }

        if (search) {
            let searchRegex = createDiacriticRegex(search);
            query.$or = [
                { title: { $regex: String(searchRegex), $options: "i" } },
                { artist: { $regex: String(searchRegex), $options: "i" } },
                { text: { $regex: String(searchRegex), $options: "i" } },
            ];
        }

        const songs = await Song.find(query)
            .populate("user")
            .populate("genre")
            .sort({ addedToPlaylist: -1, _id: 1 })
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
        const { id, playlistId } = req.params;
        const song = await Song.findById(id).populate("user").populate("genre");
        if(!song) return res.status(404).json({ success: false, message: "Song not found" });
        let nextSong = null;
        let prevSong = null;
        let randomSong = null;
        if (playlistId) {
            const playlist = await Playlist.findById(playlistId).populate("songs");
            if (playlist && playlist.songs.length > 0) {
                const songs = playlist.songs;
                const index = songs.findIndex(s => s._id.toString() === id);

                if (index !== -1) {
                    nextSong = index < songs.length - 1 ? songs[index + 1] : songs[0];
                    prevSong = index > 0 ? songs[index - 1] : songs[songs.length - 1];
                    while(randomSong === null || randomSong._id.toString() === id){
                        randomSong = songs[Math.floor(Math.random() * songs.length)];
                    }
                }
            }
        }else{
            const allSongs = await Song.find().sort({ addedToPlaylist: -1, _id: 1 });
            const index = allSongs.findIndex(s => s._id.toString() === id);
            if (index !== -1) {
                nextSong = index < allSongs.length - 1 ? allSongs[index + 1] : allSongs[0];
                prevSong = index > 0 ? allSongs[index - 1] : allSongs[allSongs.length - 1];
                while(randomSong === null || randomSong._id.toString() === id){
                    randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
                }
            }
        }
        res.json({ success: true, song, nextSong, prevSong, randomSong });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const getHomeSongs = async (req, res) => {
    try{
        const songs = await Song.find().populate("user").populate("genre").sort({ addedToPlaylist: -1, _id: 1 }).limit(7);
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
            await Song.findOneAndDelete({_id: id});
            await Playlist.updateMany(
                { songs: { $in: [id] } },
                { $pull: { songs: id } }
            );
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
        const songs = await Song.find({ user: userId }).populate("user").populate("genre").sort({ addedToPlaylist: -1, _id: 1 });
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


const downloadSong = async (req, res) => {
    try{
        const song = await Song.findById(req.params.id);
        if(!song) return res.status(404).json({ success: false, message: "Song not found" });
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="${song.title}.pdf"`);
        doc.pipe(res);
        const fontPath = path.join(__dirname, "../",  'public', 'fonts', 'DejaVuSans.ttf');
        doc.font(fontPath);
        doc.fontSize(20).text(song.title, { align: 'center' });
        doc.fontSize(16).text(`Artist: ${song.artist}`, { align: 'center' });
        doc.moveDown(2); 
        doc.fontSize(12);
        doc.text(song.text);
        doc.end();
    }catch(err){
        console.log(err)
    }
}

const getArtists = async (req, res) => {
    try{
        const { letter } = req.params;
        const artists = await Song.distinct("artist", { artist: { $regex: `^${letter}`, $options: "i" } });
        res.json({ success: true, artists });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const getTopByArtists = async (req, res) => {
    try{
        const { songId } = req.params;
        const { artist } = await Song.findById(songId);
        const artistRegex = createDiacriticRegex(artist);
        const songs = await Song.find({ artist: { $regex: String(artistRegex), $options: "i" } }).populate("user").populate("genre").sort({ addedToPlaylist: -1, _id: 1 }).limit(10);
        res.json({ success: true, songs });
    }catch(err){
        mongooseErrors(err, res)
    }
}
export { getAllSongs, addSong, getTopByArtists, getArtists, getSong, deleteSong, getMySongs, getHomeSongs, downloadSong, editSong };