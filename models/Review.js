const mongoose = require('mongoose');

const schema=mongoose.Schema;

const ReviewSchema=new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:schema.Types.ObjectId,
        ref:"User",
    },
});

const Review=mongoose.model("Review",ReviewSchema);

module.exports=Review;