import express from "express";
import cookieParser from "cookie-parser";
import songsRoutes from "./routes/song.routes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/api", songsRoutes);


export default app;
