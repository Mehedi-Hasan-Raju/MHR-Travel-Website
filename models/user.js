// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true
//     }, 
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model('User', userSchema);


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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
