// const express = require("express");
// const router = express.Router();
// const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync");
// const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware.js");
// const userController = require("../controllers/users.js");

// router.route("/signup")
// .get( userController.renderSignupForm)
// .post( wrapAsync(userController.signup))

// router.route ("/login")
// .get( userController.renderLoginForm)
// .post( saveRedirectUrl, passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
// }),
//     userController.login
// );

// router.get("/logout", userController.logout)

// module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// ============================
// AUTH ROUTES
// ============================
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

router.get("/logout", userController.logout);

// ============================
// PROFILE ROUTES
// ============================

// Show profile
router.get("/users/:id", wrapAsync(userController.showProfile));

// Edit profile form
router.get("/users/:id/edit", wrapAsync(userController.renderEditProfileForm));

// Update profile
router.put(
  "/users/:id",
  upload.single("profilePic"), // name must match <input name="profilePic">
  wrapAsync(userController.updateProfile)
);

module.exports = router;
