import { mongooseErrors } from "../config/errors.js";
import { JWT_SECRET } from "../config/index.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json({ success: true, users })
    }catch(err){
        mongooseErrors(err, res)
    }
}

const signUp = async (req, res) => {
    try{
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        let { username } = req.body;
        username = username.toLowerCase();
        await User.create({ username, hashedPassword: hashPassword, favouritePlaylists: [], role: "user" });
        res.json({ success: true })
    }catch(err){
        mongooseErrors(err, res)
    }
}

const logIn = async (req, res) => {
    try{
        let { username, password } = req.body;
        username = username.toLowerCase();
        const user = await User.findOne({ username });
        if(!user) return res.json({ success: false, message: "User not found" });
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if(!isValid) return res.json({ success: false, message: "Wrong password" });

        const generateRefreshToken = jwt.sign({ username, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
        const generateAccessToken = jwt.sign({ username, role: user.role }, JWT_SECRET, { expiresIn: "15m" })

        res.cookie("refreshToken", generateRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, accessToken: generateAccessToken })
    }catch(err){
        mongooseErrors(err, res)
    }
}


export { getAllUsers, signUp, logIn };