// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
// const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const { fileSizeLimit } = require("../cloudConfig.js"); // Import the fileSizeLimit middleware

// const listingController = require("../controllers/listings.js");
// const multer = require('multer');
// const {storage} = require("../cloudConfig.js");
// const upload = multer({storage});

// router.get("/filter/:id",wrapAsync(listingController.filter));
// router.get("/search", wrapAsync(listingController.search));

// // Using router.route to reduce lines of code
// router.route("/")
//     .get(wrapAsync(listingController.index))
//     .post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListings)); // Add fileSizeLimit middleware

// // New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.route("/:id")
//     .get(wrapAsync(listingController.showListing))
//     .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing)) // Add fileSizeLimit middleware
//     .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
// // Edit Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// module.exports = router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { fileSizeLimit } = require("../cloudConfig.js"); // Import the fileSizeLimit middleware

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.get("/filter/:id",wrapAsync(listingController.filter));
router.get("/search", wrapAsync(listingController.search));

// Using router.route to reduce lines of code
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListings)); 

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing)) 
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// ✅ Payment Page Route (add this at the bottom)
router.get("/:id/payment", isLoggedIn, wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const { checkin, checkout, guests } = req.query;

  let nights = 1;
  if (checkin && checkout) {
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diffMs = d2 - d1;
    const rawNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (!Number.isNaN(rawNights) && rawNights > 0) nights = rawNights;
  }

  const nightly = Number(listing.price) || 0;
  const subtotal = nightly * nights;

  res.render("listings/payment", {
    listing,
    query: {
      checkin: checkin || "",
      checkout: checkout || "",
      guests: guests || "1",
    },
    price: {
      nights,
      nightly,
      subtotal,
      total: subtotal, 
      currency: "USD", 
    },
  });
}));

module.exports = router;
