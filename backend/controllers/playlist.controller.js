import { mongooseErrors } from "../config/errors.js";
import Playlist from "../models/playlist.model.js";


const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({isPublic: true}).populate("user");
        res.json({ success: true, playlists });
    } catch (error) {
        mongooseErrors(err, res)
    }
}

const getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id).populate("user");
        res.json({ success: true, playlist });
    } catch (error) {
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


export { getAllPlaylists, createPlaylist, getPlaylist };