const Listing=require("./models/listings");
const Review=require("./models/Review.js")
const {listingSchema,reviewSchema}=require('./schema.js');
const ExpressError=require('./utils/ExpressError.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    console.log("Received req.body:", req.body);
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    console.log("Received req.body:", req.body);
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review){
        req.flash("error","Review does not exist");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You didn't create this review");
        return res.redirect(`/listings/${id}`)
    }  
    next();
}