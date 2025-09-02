// const User = require("../models/user");

// module.exports.renderSignupForm = (req,res)=>{
//     res.render("users/signup.ejs");
// };

// module.exports.signup = async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
//         console.log(registeredUser);
//         req.login(registeredUser, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             req.flash("success", "Welcome Here!");
//             res.redirect("/listings");
//         });
//     } catch (e) {
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
// };

// module.exports.renderLoginForm = (req,res)=>{
//     res.render("users/login.ejs");
// };


// module.exports.login = async (req,res) =>{
//     req.flash("success","Welcome Back");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
// res.redirect(redirectUrl);
// };

// module.exports.logout = (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         req.flash("success", "you are logged out!");
//         res.redirect("/listings");
//     })
// };

const User = require("../models/user");
const Booking = require("../models/booking"); // make sure you import your Booking model

// ============================
// AUTH CONTROLLERS
// ============================

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome Here!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};


// PROFILE CONTROLLERS

// Show user profile
module.exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }

        const tab = req.query.tab || "about";

        let upcomingTrips = [];
        let pastTrips = [];

        if (tab === "past-trips") {
            const bookings = await Booking.find({ user: req.params.id }).populate('listing');

            const today = new Date();

            upcomingTrips = bookings.filter(b => new Date(b.date) >= today);
            pastTrips = bookings.filter(b => new Date(b.date) < today);
        }

        res.render("users/profile.ejs", { 
            user, 
            tab, 
            upcomingTrips, 
            pastTrips 
        });
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};


// Render edit profile form
module.exports.renderEditProfileForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }
        res.render("users/editProfile.ejs", { user });
    } catch (e) {
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, phone } = req.body;
    const userData = { name, bio, phone };

    // If an image is uploaded, save the Cloudinary URL
    if (req.file) {
      userData.profilePic = req.file.path; // multer + Cloudinary stores URL in req.file.path
    }

    const user = await User.findByIdAndUpdate(req.params.id, userData, { new: true });
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/users/${user._id}`);
  } catch (e) {
    req.flash("error", "Could not update profile");
    res.redirect(`/users/${req.params.id}/edit`);
  }
};

