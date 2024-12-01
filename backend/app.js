import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import songsRoutes from "./routes/song.routes.js";
import userRoutes from "./routes/user.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import path from 'path'
import { NODE_ENV } from "./config/index.js";
 
const __dirname = path.resolve()


const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://repertorify.onrender.com'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

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
