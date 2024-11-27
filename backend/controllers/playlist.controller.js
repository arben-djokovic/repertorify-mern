import { mongooseErrors } from "../config/errors.js";
import Playlist from "../models/playlist.model.js";
import User from '../models/user.model.js';
import { PLAYLISTS_PER_PAGE } from "../config/index.js";


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
        const playlist = await Playlist.findById(id).populate("user");
        res.json({ success: true, playlist });
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
        const response = await User.findById(req.user._id).populate("favouritePlaylists");
        res.json({ success: true, playlists: response.favouritePlaylists });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const likePlaylist = async (req, res) => {
    try{
        const response = await User.findOneAndUpdate({ _id: req.user._id }, { $push: { favouritePlaylists: req.params.id } }, { new: true }).populate("favouritePlaylists");
        await Playlist.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } });
        res.json({ success: true, favouritePlaylists: response.favouritePlaylists });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const unlikePlaylist = async (req, res) => {
    try{
        const response = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { favouritePlaylists: req.params.id } }, { new: true }).populate("favouritePlaylists");
        await Playlist.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: -1 } });
        res.json({ success: true, favouritePlaylists: response.favouritePlaylists });
    }catch(err){
        mongooseErrors(err, res)
    }
}


export { getAllPlaylists, createPlaylist, getPlaylist, getMyPlaylists, getFavouritePlaylists, likePlaylist, unlikePlaylist };