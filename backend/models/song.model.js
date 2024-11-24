import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxLength: 40,
    },
    text: {
        type: String,
        required: true,
        minlength: 10,
        maxLength: 1000,
    },
    artist: {
        type: String,
        required: true,
        minlength: 1,
        maxLength: 40,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Song = mongoose.model("Song", songSchema);

export default Song;