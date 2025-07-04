import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import songsRoutes from "./routes/song.routes.js";
import userRoutes from "./routes/user.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import path from 'path'
import { NODE_ENV } from "./config/index.js";
import helmet from 'helmet'
import xssClean from 'xss-clean'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import { generateSiteMapFile } from './controllers/sitemap.controller.js'
 
const __dirname = path.resolve()


const app = express();

app.set('trust proxy', true);

app.use((req, res, next) => {
  if (req.hostname === "repertoar-b0ck.onrender.com") {
    return res.redirect(301, "https://repertorify.com" + req.originalUrl);
  }
  next();
});

app.use(helmet());

app.use(cors({
    origin: ['https://repertoar-b0ck.onrender.com', 'https://repertorify.com'],  // http://localhost:3000 https://repertoar-b0ck.onrender.com
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(xssClean());

app.use(hpp());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);


// Middleware
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/api", songsRoutes);
app.use("/api", userRoutes);
app.use("/api", genreRoutes);
app.use("/api", playlistRoutes);
app.get("/sitemap.xml", generateSiteMapFile)

if(NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*',(req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

export default app;
