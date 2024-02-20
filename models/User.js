import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    isAdmin : {
      type : Boolean,
      default : false
    },
    gender: {
      type: String,
      default: "Male",
      validate: {
        validator: function(value) {
          const validGenders = ["Male", "male", "Female", "female","Others","others"];
          return validGenders.includes(value);
        },
        message: "Invalid gender"
      }
    },
    profilePicture: String,
    coverPicture : String,
    about: String,
    livesIn: String,
    worksAt: String,
    age : Number,
    relationship: String,
    dob : Date,
    phone: {
      type: String,
      validate: {
        validator: function(value) {
          const telephoneRegex = /^\+?\d{1,4}?[-. ]?\(?[0-9]*\)?[-. ]?[0-9]+[-. ]?[0-9]+$/;
          return telephoneRegex.test(value);
        },
        message: "Invalid telephone number format. Please provide a valid telephone number."
      }
    },
    followers : [],
    following : []
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
