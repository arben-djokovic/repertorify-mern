import { mongooseErrors } from "../config/errors.js";
import { JWT_SECRET, REFRESH_JWT_SECRET, MIN_PASSWORD_LENGTH, NODE_ENV } from "../config/index.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Song from '../models/song.model.js'
import Playlist from '../models/playlist.model.js'

const ACCESS_TOKEN_EXPIRES_IN = "12h";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const refreshCookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

const signAccessToken = (user) => jwt.sign({ _id: user._id, username: user.username, role: user.role, isBlocked: user.isBlocked }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
const signRefreshToken = (user) => jwt.sign({ _id: user._id }, REFRESH_JWT_SECRET, { expiresIn: REFRESH_TOKEN_MAX_AGE / 1000 });

const passwordTooShort = (password) => typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH;
const passwordTooShortMessage = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json({ success: true, users })
    }catch(err){
        mongooseErrors(err, res)
    }
}

const signUp = async (req, res) => {
    if(passwordTooShort(req.body.password)) return res.json({ success: false, message: passwordTooShortMessage });
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
        const user = await User.findOne({ username }).select("+hashedPassword");
        const isValid = user && await bcrypt.compare(password, user.hashedPassword);
        if(!isValid) return res.json({ success: false, message: "Wrong username or password" });

        res.cookie("refreshToken", signRefreshToken(user), { ...refreshCookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE });

        const numberOfSongs = await Song.countDocuments({ user: user._id });
        const numberOfPlaylists = await Playlist.countDocuments({ user: user._id });

        res.json({ success: true, accessToken: signAccessToken(user), favouritePlaylists: user.favouritePlaylists, numberOfSongs, numberOfPlaylists, user: { _id: user._id, username: user.username, role: user.role, isBlocked: user.isBlocked } });
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
    if(!oldPassword || !newPassword)
        return res.json({ success: false, message: "Missing fields" });
    if(passwordTooShort(newPassword))
        return res.json({ success: false, message: passwordTooShortMessage });

    try {
        const user = await User.findById(req.user._id).select("+hashedPassword");
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
        let payload;
        try{
            payload = jwt.verify(refreshToken, REFRESH_JWT_SECRET);
        }catch{
            res.clearCookie("refreshToken", refreshCookieOptions);
            return res.json({ success: false, message: "Unauthorized" });
        }
        // Load the user so the new access token carries the current username/role
        const user = await User.findById(payload._id);
        if(!user) return res.json({ success: false, message: "Unauthorized" });
        res.json({ success: true, accessToken: signAccessToken(user) });
    }catch(err){
        mongooseErrors(err, res)
    }
}
const logOut = async (req, res) => {
    try{
        res.clearCookie("refreshToken", refreshCookieOptions);
        res.json({ success: true });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).populate("favouritePlaylists");
        res.json({ success: true, user });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const blockUser = async (req, res) => {
    try{
        const response = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
        res.json({ success: true, user: response });
    }catch(err){
        mongooseErrors(err, res)
    }
}

const unblockUser = async (req, res) => {
    try{
        const response = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
        res.json({ success: true, user: response });
    }catch(err){
        mongooseErrors(err, res)
    }
}

export { getAllUsers, getUser, signUp, logIn, changeUsername, changePassword, unblockUser, refreshAccessToken, logOut, blockUser };
