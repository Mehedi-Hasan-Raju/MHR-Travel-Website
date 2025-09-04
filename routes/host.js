const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Redirect /host to /host/dashboard
router.get("/", (req, res) => {
  res.redirect("/host/dashboard");
});

// Host Dashboard
router.get("/dashboard", isLoggedIn, wrapAsync(async (req, res) => {
  if (!req.user.isHost) {
    req.flash("error", "Access denied! Only hosts can view this page.");
    return res.redirect("/listings");
  }

  const tab = req.query.tab || "listings";

  let listings = [];
  let bookings = [];

  if(tab === "listings") {
    listings = await Listing.find({ owner: req.user._id });
  }

  if(tab === "booked") {
    bookings = await Booking.find()
      .populate("listing")
      .populate("user");
    bookings = bookings.filter(b => b.listing.owner.equals(req.user._id));
  }

  res.render("host/dashboard.ejs", { tab, listings, bookings });
}));

module.exports = router;
