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
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import { generateSiteMapFile } from './controllers/sitemap.controller.js'
import { seoRenderSong, seoRenderPlaylist, seoRenderDefault } from './controllers/seo.controller.js'
 
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

const allowedOrigins = ['https://repertorify.com', 'https://radnik-app.vercel.app'];
if (NODE_ENV !== 'production') allowedOrigins.push('http://localhost:3000');

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(hpp());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
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
    // index: false so "/" also goes through the SEO renderer instead of the raw index.html
    app.use(express.static(path.join(__dirname, '/frontend/build'), { index: false }))
    app.get(['/songs/:id', '/playlists/:playlistId/songs/:id'], seoRenderSong)
    app.get('/playlists/:id', seoRenderPlaylist)
    app.get('*', seoRenderDefault)
}

export default app;
