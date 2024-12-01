import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 20
    },
    isPublic: {
        type: Boolean,
        default: false,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
            unique: true
        }
    ],
    imageLocation: {
        type: String,
        required: true,
    }

})

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist