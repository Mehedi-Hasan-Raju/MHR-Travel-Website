const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const User = require("../models/user");

// ================= AUTH ROUTES =================
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
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

// ================= PROFILE ROUTES =================

// Show profile
router.get("/users/:id", wrapAsync(userController.showProfile));

// Edit profile form
router.get("/users/:id/edit", wrapAsync(userController.renderEditProfileForm));

// Update profile
router.put(
  "/users/:id",
  upload.single("profilePic"),
  wrapAsync(userController.updateProfile)
);

// ================= ROLE SWITCH ROUTE =================
router.post(
  "/users/:id/switch-role",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect("/listings");
    }

    // Toggle between host & traveler
    user.isHost = !user.isHost;
     user.role = user.isHost ? "host" : "traveler";
    await user.save();

    req.flash(
      "success",
      `Switched to ${user.isHost ? "Host" : "Traveler"} mode!`
    );

    if (user.isHost) {
      return res.redirect("/host/dashboard");
    } else {
      return res.redirect("/listings");
    }
  })
);

module.exports = router;
