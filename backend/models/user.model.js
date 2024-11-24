import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    favouritePlaylists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Playlist"
        }
    ],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})

const User = mongoose.model("User", userSchema);

export default User