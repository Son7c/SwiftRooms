const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")

const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    //All Listings
    .get(wrapAsync(listingController.index))

    //Create Listing
    .post(isLoggedIn, upload.single('listing[images]'), wrapAsync(listingController.createListing));


//New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    //Individual listing
    .get(wrapAsync(listingController.showListing))

    //editSubmitRoute
    .put(isLoggedIn, isOwner, upload.single('listing[images]'), validateListing, wrapAsync(listingController.editListing))

    //delete route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

//editroute
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;