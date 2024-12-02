import { mongooseErrors } from "../config/errors.js";
import Playlist from "../models/playlist.model.js";
import User from '../models/user.model.js';
import { PLAYLISTS_PER_PAGE } from "../config/index.js";
import { getUserFromToken } from "../middlewares/middlewares.js";
import Song from "../models/song.model.js";


const getAllPlaylists = async (req, res) => {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1; 
    const limit = page * PLAYLISTS_PER_PAGE;
    let query = { isPublic: true, name: { $regex: String(search), $options: "i" } };
    if(search === 'undefined'){
        query.name = { $regex: String(""), $options: "i" };
    }
    try {
        const playlists = await Playlist.find(query).populate("user").sort({ likes: -1 }).limit(limit);
        const totalPlaylists = await Playlist.countDocuments({isPublic: true});
        console.log(query)
        res.json({ success: true, playlists, hasMore: totalPlaylists > limit });
    } catch (error) {
        mongooseErrors(err, res)
    }
}
 
const getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById({_id: id, isPublic: true}).populate("user").populate({path: "songs", populate: {path: "user",model: "User"}});;
        if(!playlist) return res.status(404).json({ success: false, message: "Playlist not found" });
        if(playlist.isPublic) return res.json({ success: true, playlist });
        const user = getUserFromToken(req);
        console.log(user, playlist)
        if(!user) return res.status(401).json({ success: false, message: "Unauthorized" });
        if(playlist.user._id.toString() === user._id.toString()) return res.json({ success: true, playlist });
        return res.status(403).json({ success: false, message: "Unauthorized to view this playlist" });
    } catch (err) {
        mongooseErrors(err, res)
    }
}

const getMyPlaylists = async (req, res) => {
    try{
        const response = await Playlist.find({user: req.user._id}).populate("user").populate("songs").sort({ likes: -1 });
        res.json({ success: true, playlists: response });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const createPlaylist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, isPublic, imageLocation  } = req.body;
        const playlist = await Playlist.create({ name, isPublic: isPublic, user: userId, songs: [], imageLocation: imageLocation });
        res.json({ success: true, playlist });
    } catch (err) {
        mongooseErrors(err, res)
    }
}

const getFavouritePlaylists = async (req, res) => {
    try{
        const response = await User.findById(req.user._id).populate("favouritePlaylists")
        const playlists = await Playlist.find({ _id: { $in: response.favouritePlaylists } }).populate("user").sort({ likes: -1 });
        res.json({ success: true, playlists: playlists });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const likePlaylist = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        if(user.favouritePlaylists.includes(req.params.id)) return res.status(400).json({ success: false, message: "Playlist already liked" });
        const response = await User.findOneAndUpdate({ _id: req.user._id }, { $push: { favouritePlaylists: req.params.id } }, { new: true }).populate("favouritePlaylists");
        await Playlist.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } });
        res.json({ success: true, favouritePlaylists: response.favouritePlaylists });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const unlikePlaylist = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        if(!user.favouritePlaylists.includes(req.params.id)) return res.status(400).json({ success: false, message: "Playlist not liked" });
        const response = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { favouritePlaylists: req.params.id } }, { new: true }).populate("favouritePlaylists");
        await Playlist.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: -1 } });
        res.json({ success: true, favouritePlaylists: response.favouritePlaylists });
    }catch(err){
        mongooseErrors(err, res)
    }
}


const deletePlaylist = async (req, res) => {
    try{
        if(req.user.role === "admin"){
            await Playlist.findByIdAndDelete(req.params.id);
            return res.json({ success: true, message: "Playlist deleted successfully" });
        }
        else{
            const playlist = await Playlist.findById(req.params.id);
            if(playlist.user.toString() === req.user._id.toString()){
                await Playlist.findByIdAndDelete(req.params.id);
                await User.updateMany({favouritePlaylists: { $in: [req.params.id] }}, { $pull: { favouritePlaylists: req.params.id } });
                return res.json({ success: true, message: "Playlist deleted successfully" });
            }
            else{
                return res.status(403).json({ success: false, message: "Unauthorized to delete this playlist" });
            }
        }
    }catch(err){
        mongooseErrors(err, res)
    }
}

const editPlaylist = async (req, res) => {
    try{
        const { id } = req.params;
        const playlist = await Playlist.findById(id).populate("user");
        if(!playlist) return res.status(404).json({ success: false, message: "Playlist not found" });
        if(playlist.user._id.toString() !== req.user._id && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Unauthorized to edit this playlist" }); 
        const { name, isPublic, imageLocation } = req.body;
        playlist.name = name;
        playlist.isPublic = isPublic;
        playlist.imageLocation = imageLocation;
        await playlist.save();
        res.json({ success: true, playlist });

    }catch(err){
        mongooseErrors(err, res)
    }
}

const addSongToPlaylists = async (req, res) => {
    const songId = req.body.songId;
    const playlistIds = req.body.playlistIds
    const userId = req.user._id;
    try{
        await Playlist.updateMany({ _id: { $in: playlistIds }, user: userId, songs: { $nin: [songId] } }, { $push: { songs: songId } });
        await Song.updateOne({ _id: songId }, { $inc: { addedToPlaylist: playlistIds.length } });
        res.json({ success: true });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const removeFromPlaylist = async (req, res) => {
    const { songId, playlistId } = req.body;
    if(!songId || !playlistId) return res.status(400).json({ success: false, message: "Missing songId or playlistId" });
    try{
        const playlist = await Playlist.findById(playlistId).populate("user");
        if(playlist.user._id.toString() !== req.user._id && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Unauthorized to edit this playlist" }); 
        await Playlist.updateOne({ _id: playlistId, songs: { $in: [songId] }}, { $pull: { songs: songId } });
        await Song.updateOne({ _id: songId }, { $inc: { addedToPlaylist: -1 } });
        res.json({ success: true });
    }catch(err){
        mongooseErrors(err, res)
    }
}


export { getAllPlaylists, addSongToPlaylists, removeFromPlaylist, createPlaylist, getPlaylist, getMyPlaylists, getFavouritePlaylists, likePlaylist, unlikePlaylist, deletePlaylist, editPlaylist };