const Listing = require("../models/listing");

//index Router
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
};

// new Route
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", {
    listing,
    currUser: req.user,
    mapToken: process.env.MAP_TOKEN,
    locationQuery: listing.locationQuery,
  });
};

// SHOW LISTING
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    listing,
    currUser: req.user,
    mapToken: process.env.MAP_TOKEN,
  });
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  try{
  const locationQuery = req.body.listing.location;

  // Default fallback coordinates
  let coordinates = [77.209, 28.6139];

  if (locationQuery) {
    try {
      const apiKey = process.env.MAP_TOKEN;
      const query = encodeURIComponent(locationQuery);
      const response = await fetch(`https://api.maptiler.com/geocoding/${query}.json?key=${apiKey}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        coordinates = data.features[0].geometry.coordinates; // [lng, lat]
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  }

  const url = req.file.path;
  const filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.locationQuery = locationQuery;

    // Save according to your schema
    newListing.geometry = {
      type: "Point",
      coordinates
    };

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
} catch (err){
  next(err);
}
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
