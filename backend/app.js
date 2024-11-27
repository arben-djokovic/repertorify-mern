import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import songsRoutes from "./routes/song.routes.js";
import userRoutes from "./routes/user.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import path from 'path'
import { NODE_ENV } from "./config/index.js";
 
const __dirname = path.resolve()


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Use routes
app.use("/api", songsRoutes);
app.use("/api", userRoutes);
app.use("/api", genreRoutes);
app.use("/api", playlistRoutes);

if(NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*',(req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

export default app;
