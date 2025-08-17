const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //index Route
  .get(wrapAsync(listingController.index))
  // Create Route
  .post(
    isLoggedIn,
    validateListing, //pass validater func as middleware
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showListing))
  //Update Route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  //Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
