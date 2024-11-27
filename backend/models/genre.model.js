import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 2,
        maxLength: 20
    }
})

const Genre = mongoose.model("Genre", genreSchema);

export default Genre