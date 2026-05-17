const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listings.js');

main()
    .then(()=>{
        console.log("Succesfull");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/souvik');
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"67fe7f723eb8a694f1af3542",
        images: obj.image ? [{ url: obj.image.url, filename: obj.image.filename }] : []
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();