const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Create booking
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    const { listingId, date } = req.body;

    // Save booking
    const booking = new Booking({
        user: req.user._id,
        listing: listingId,
        date
    });
    await booking.save();

    // Populate listing info to display on success page
    await booking.populate("listing");


    res.redirect(`/bookings/${booking._id}/success`);
}));

// Success page
router.get("/:id/success", isLoggedIn, wrapAsync(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate("listing");
    res.render("bookings/success.ejs", { booking });
}));

module.exports = router;
