import { mongooseErrors } from "../config/errors.js";
import { JWT_SECRET } from "../config/index.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Song from '../models/song.model.js'
import Playlist from '../models/playlist.model.js'

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json({ success: true, users })
    }catch(err){
        mongooseErrors(err, res)
    }
}

const signUp = async (req, res) => {
    if(req.body.password.length < 5) return res.json({ success: false, message: "Password must be at least 5 characters long" });
    try{
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        let { username } = req.body;
        username = username.toLowerCase().replace(/\s+/g, '');
        await User.create({ username, hashedPassword: hashPassword, favouritePlaylists: [], role: "user" });
        res.json({ success: true })
    }catch(err){
        mongooseErrors(err, res)
    }
}

const logIn = async (req, res) => {
    try{
        let { username, password } = req.body;
        username = username.toLowerCase().replace(/\s+/g, '');
        const user = await User.findOne({ username });
        if(!user) return res.json({ success: false, message: "User not found" });
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if(!isValid) return res.json({ success: false, message: "Wrong password" });

        const generateRefreshToken = jwt.sign({ _id: user._id,  username, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
        const generateAccessToken = jwt.sign({ _id: user._id,  username, role: user.role }, JWT_SECRET, { expiresIn: "15m" })

        res.cookie("refreshToken", generateRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            domain: '',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const numberOfSongs = await Song.countDocuments({ user: user._id });
        const numberOfPlaylists = await Playlist.countDocuments({ user: user._id });

        setTimeout(() => {
            res.json({ success: true, accessToken: generateAccessToken, favouritePlaylists: user.favouritePlaylists, numberOfSongs, numberOfPlaylists });
        }, 1000);
    }catch(err){
        mongooseErrors(err, res)
    }
}

const changeUsername = async (req, res) => {
    try{
        const reponse = await User.findByIdAndUpdate(req.user._id, { username: req.body.username.toLowerCase().replace(/\s+/g, '') }, { new: true });
        res.json({ success: true, username: reponse.username })
    }catch(err){
        mongooseErrors(err, res)
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if(newPassword.length < 5) 
        return res.json({ success: false, message: "Password must be at least 5 characters long" });
    if(!oldPassword || !newPassword) 
        return res.json({ success: false, message: "Missing fields" });
    
    try {
        const user = await User.findById(req.user._id);
        const isValid = await bcrypt.compare(oldPassword, user.hashedPassword)
        if(!isValid) return res.json({ success: false, message: "Wrong password" });

        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.hashedPassword = hashPassword;
        await user.save();
        res.json({ success: true })
    } catch(err) {
        mongooseErrors(err, res);
    }
};

const refreshAccessToken = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.json({ success: false, message: "Unauthorized" });
        const user = jwt.verify(refreshToken, JWT_SECRET);
        const accessToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
        res.json({ success: true, accessToken });
    }catch(err){
        mongooseErrors(err, res)
        console.log(err)
    }
}
const logOut = async (req, res) => {
    try{
        res.clearCookie("refreshToken");
        res.json({ success: true });
    }catch(err){
        mongooseErrors(err, res)
    }
}


export { getAllUsers, signUp, logIn, changeUsername, changePassword, refreshAccessToken, logOut };