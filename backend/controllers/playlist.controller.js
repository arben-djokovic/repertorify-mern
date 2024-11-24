import { mongooseErrors } from "../config/errors.js";
import Playlist from "../models/playlist.model.js";


const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().populate("user");
        res.json({ success: true, playlists });
    } catch (error) {
        mongooseErrors(err, res)
    }
}


export { getAllPlaylists };