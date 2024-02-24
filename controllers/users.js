import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

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
    console.log("request accepted");
    const {id}=req.params;
    const {_id,password}=req.body;
    if(id===_id){
      if(password){
        const salt=await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(password,salt);
      }
      const user=await UserModel.findByIdAndUpdate(id,req.body,{new : true})
      const token=jwt.sign({email : user.email,id : user.id},process.env.JWT_SECRET_KEY,{expiresIn : "1h"})
      console.log(user);
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


export const registerEvent = async (req, res) => {
  const { email, hexId } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'your_email@example.com',
      pass: 'your_password',
    },
  });

  // Send email to backend
  let backendInfo = await transporter.sendMail({
    from: '"Your Name" <your_email@example.com>', // sender address
    to: 'backend@example.com', // list of receivers
    subject: 'New Event Registration', // Subject line
    text: `A user with ID ${hexId} has registered for an event. Details: ${JSON.stringify(eventData)}`, // plain text body
  });

  // Send email to frontend
  let frontendInfo = await transporter.sendMail({
    from: '"Your Name" <your_email@example.com>', // sender address
    to: email, // list of receivers
    subject: 'Event Registration Confirmation', // Subject line
    text: 'Thank you for registering for the event. Your registration ID is: ' + hexId, // plain text body
  });

  console.log("Emails sent: backend -", backendInfo.messageId, ", frontend -", frontendInfo.messageId);
  res.status(200).json({ message: 'Event registration successful' });
};


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
