import { mongooseErrors } from "../config/errors.js";
import User from "../models/user.model.js";

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json({ success: true, users })
    }catch(err){
        mongooseErrors(err, res)
    }
}

export { getAllUsers };