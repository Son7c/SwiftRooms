if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');




const listingsRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/reviews.js');
const userRouter=require('./routes/user.js')


const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

const dburl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24 * 60 * 60 * 1000,
        maxAge: 7*24 * 60 * 60 * 1000,
        httpOnly: true
    },
};



app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.engine('ejs', ejsmate);

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


main()
    .then(() => {
        console.log("Succesfull");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dburl);
}

app.get('/', (req, res) => {
    res.redirect('/listings'); // Redirect to the listings page
});




app.use('/listings', listingsRouter);
app.use('/listings/:id', reviewsRouter); 
app.use('/',userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

//Error handler
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went Wrong" } = err;
    res.status(statuscode).render("error.ejs", { message });
})

app.listen(3000);