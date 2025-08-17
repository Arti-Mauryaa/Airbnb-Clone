const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { cloudinary } = require("../cloudConfig.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url : String,
    filename : String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner : {
    type: Schema.Types.ObjectId,
    ref : "User",
  },
  geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  // category : {
  //   type : String,
  //   enum : ["Arctic", "Amazing pool", "Rooms", "etc"]
  // }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); //delete all reviews corresponding to deleting listing

    // delete image from cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
      console.log(" Deleted image from Cloudinary:", listing.image.filename);
    }

  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
