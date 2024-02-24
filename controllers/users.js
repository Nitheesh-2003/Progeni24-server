import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if(user){
      const {password,...otherDetails}=user._doc;
      res.status(200).json(otherDetails);
    }
    else{
      res.status(404).json({msg : "No such user exists"});
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* UPDATE USER */

export const updateUser=async (req,res)=>{
  try {
    const {id}=req.params;
    const {_id,password}=req.body;
    if(id===_id){
      if(password){
        const salt=await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(password,salt);
      }
      const user=await UserModel.findByIdAndUpdate(id,req.body,{new : true})
      const token=jwt.sign({email : user.email,id : user.id},process.env.JWT_SECRET_KEY,{expiresIn : "1h"})
      res.status(200).json({user,token});
    }
    else{
      res.status(403).json({ msg : "Access Denied" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

/* DELETE */

export const deleteUser=async(req,res)=>{
  try {
    const {id}=req.params;
    const {currentUserId,currentUserAdminStatus}=req.body;
    if(id===currentUserId || currentUserAdminStatus){
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({msg : "User Deleted Successfully"});
    }else{
      res.status(403).json({ msg : "Access Denied" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export const getAllUsers = async (req,res)=>{
  try {
    const users=await UserModel.find();
    const newUsers=users.map((user)=>{
      const {password,...otherDetails}=user._doc;
      return otherDetails;
    })
    res.status(200).json(newUsers);
  } catch (err) {
    res.status(500).json({err : err.message});
  }
}
