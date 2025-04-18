const user=require("../models/user"); 

module.exports.signup=async (req,res)=>{
    try{
        let{username,email,password}=req.body;
        console.log(req.body);
        const newUser=new user({email,username});
        const regUser=await user.register(newUser,password);
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to SwiftRooms");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup ");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/listings");
    })
}

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}