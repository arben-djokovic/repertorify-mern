import mongoose from "mongoose";
import Playlist from "./playlist.model.js";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxLength: 40,
    },
    text: {
        type: String,
        required: true,
        minlength: 10,
        maxLength: 10000,
    },
    artist: {
        type: String,
        required: true,
        minlength: 1,
        maxLength: 40,
        trim: true,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    addedToPlaylist: {
        type: Number,
        default: 0
    }
})

const Song = mongoose.model("Song", songSchema);

export default Song;