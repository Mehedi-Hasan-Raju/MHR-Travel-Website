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
    default: "", // User full name
  },
  profilePic: {
    type: String,
    default: "", // store image URL (Cloudinary, AWS S3, or local)
  },
  bio: {
    type: String,
    default: "", // short description
  },
  phone: {
    type: String,
    default: "",
  },
  // Role as string: traveler or host
  role: {
    type: String,
    enum: ["traveler", "host"],
    default: "traveler",
  },
  // Boolean flag for quick checks
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
