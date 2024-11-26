
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SONGS_PER_PAGE = process.env.SONGS_PER_PAGE;
export const PLAYLISTS_PER_PAGE = process.env.PLAYLISTS_PER_PAGE;
export const NODE_ENV = process.env.NODE_ENV


