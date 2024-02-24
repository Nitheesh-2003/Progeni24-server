import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if(token){
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.body._id = verified?.id;
    }
    next();
  } catch (err) {
    console.log("JWT error");
    res.status(500).json({ error: err.message });
  }
};
