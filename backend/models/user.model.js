import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 10,
        trim: true,
        lowercase: true
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
    },
    songSteps: [
        {
            songId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song"
            },
            step: {
                type: Number,
                required: true,
                min: -5,
                max: 5
            }
        }
    ],
    isBlocked: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("User", userSchema);

export default User