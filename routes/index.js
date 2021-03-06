var Restaurant = require("../models/restaurant");
var Comment = require("../models/comments");
var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/users");
var middleware = require("../middleware");



router.get("/",function(req,res){
	res.render("landing");
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
//username is unique
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
			req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
		   req.flash("success", "Welcome to Restaurant in Ann Arbor" + user.username);
           res.redirect("/restaurants"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/restaurants");
});



module.exports = router;