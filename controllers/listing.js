const Listing=require("../models/listings.js");

const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });



module.exports.index=async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm=(req, res) => {
    res.render("listings/newlisting.ejs");
}

module.exports.createListing=async (req, res) => {
    let newlisting = new Listing(req.body.listing);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.images = [{ url, filename }];
    }
    newlisting.owner=req.user._id;
    const result = await geocoder.geocode(newlisting.location);
    if (result && result.length > 0) {
        const geo = result[0];
        newlisting.geometry = {
            type: "Point",
            coordinates: [geo.longitude, geo.latitude]
        };
    } else {
        newlisting.geometry = {
            type: "Point",
            coordinates: [0, 0]
        };
    }
    let saveListings=await newlisting.save();
    console.log(saveListings);
    req.flash('success', 'New Listing Created');
    res.redirect("/listings");
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash('error', 'Listing Does not Exist');
        return res.redirect("/listings");
    }
    res.render("listings/listing.ejs", { listing });
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Listing Does not Exist');
        return res.redirect("/listings");
    }

    let originalUrl = "";
    if (listing.images && listing.images.length > 0) {
        originalUrl = listing.images[0].url.replace("/upload", "/upload/w_250");
    } else {
        originalUrl = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
    }
    res.render("listings/editlisting.ejs", { listing ,originalUrl});
}

module.exports.editListing=async (req, res) => {
    let { id } = req.params;

    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.images=[{url,filename}];
        await listing.save();
    }

    req.flash('success', 'Listing Updated');
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully');
    res.redirect("/listings");
}