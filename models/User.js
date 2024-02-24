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
    techevents: {
      type: [String], 
      default: [] 
    },
    nontechevents: {
      type: [String], 
      default: [] 
    },
    registerId: {
      type: String,
      unique: true,
      match: [/^[0-9a-fA-F]{7}$/, 'RegisterId must be 7 characters long and contain only hexadecimal characters']
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
