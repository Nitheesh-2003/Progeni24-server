import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

/* REGISTER USER */
export const registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password=passwordHash;
    const newUser = new UserModel(req.body);
    const {email} = req.body;
    const oldUser=await UserModel.findOne({email});
    if(oldUser){
      return res.status(400).json({msg : "User already Exists.."});
    }
    const user=await newUser.save();
    const token=jwt.sign({email : user.email,id : user._id},process.env.JWT_SECRET_KEY,{expiresIn : '1h'});
    res.status(200).json({user,token});
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if(user){
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.status(400).json({msg : "Incorrect Password"});
      }
      else{
        const token=jwt.sign({email : user.email,id : user._id},process.env.JWT_SECRET_KEY,{expiresIn : '1h'});
        res.status(200).json({user,token });
      }
    }
    else{
      res.status(400).json({msg : "User does not exist. "})
    }
    // delete user.password;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
