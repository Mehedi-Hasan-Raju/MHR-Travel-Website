const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "", 
  },
  profilePic: {
    type: String,
    default: "", 
  },
  bio: {
    type: String,
    default: "", 
  },
  phone: {
    type: String,
    default: "",
  },
  
  role: {
    type: String,
    enum: ["traveler", "host"],
    default: "traveler",
  },
 
  isHost: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Passport-local plugin for authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
