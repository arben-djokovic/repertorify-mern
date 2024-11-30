import { mongooseErrors } from "../config/errors.js";
import Playlist from "../models/playlist.model.js";
import User from '../models/user.model.js';
import { PLAYLISTS_PER_PAGE } from "../config/index.js";
import { getUserFromToken } from "../middlewares/middlewares.js";


const getAllPlaylists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = page * PLAYLISTS_PER_PAGE;
        const playlists = await Playlist.find({isPublic: true}).populate("user").limit(limit);
        const totalPlaylists = await Playlist.countDocuments({isPublic: true});
        res.json({ success: true, playlists, hasMore: totalPlaylists > limit });
    } catch (error) {
        mongooseErrors(err, res)
    }
}
 
const getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById({_id: id, isPublic: true}).populate("user");
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
        const response = await Playlist.find({user: req.user._id}).populate("user").populate("songs");
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
        const playlists = await Playlist.find({ _id: { $in: response.favouritePlaylists } }).populate("user");
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


export { getAllPlaylists, createPlaylist, getPlaylist, getMyPlaylists, getFavouritePlaylists, likePlaylist, unlikePlaylist, deletePlaylist, editPlaylist };