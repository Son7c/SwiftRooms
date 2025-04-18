const mongoose = require('mongoose');
const Review=require("./Review.js")
const schema=mongoose.Schema;

const listingSchema=new schema({
    title:String,
    description:String,
    image:{
        url:String,
        filename:String, 
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;