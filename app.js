// ps -ef | grep node
// pkill -f node  to restart server
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var campgrounds = [
		{name:"Palm Palace Restaurant",image:"https://media-cdn.tripadvisor.com/media/photo-p/09/8b/95/b9/palm-palace-restaurant.jpg"},			{name:"Sava's",image:"https://media-cdn.tripadvisor.com/media/photo-s/15/c7/42/0c/sava-s.jpg"},
		{name:"The Chop House",image:"https://media-cdn.tripadvisor.com/media/photo-s/0a/b5/5e/0b/strip-potatoes-and-delicious.jpg"},
		{name:"Palm Palace Restaurant",image:"https://media-cdn.tripadvisor.com/media/photo-p/09/8b/95/b9/palm-palace-restaurant.jpg"},			{name:"Sava's",image:"https://media-cdn.tripadvisor.com/media/photo-s/15/c7/42/0c/sava-s.jpg"},
		{name:"The Chop House",image:"https://media-cdn.tripadvisor.com/media/photo-s/0a/b5/5e/0b/strip-potatoes-and-delicious.jpg"},
		{name:"Palm Palace Restaurant",image:"https://media-cdn.tripadvisor.com/media/photo-p/09/8b/95/b9/palm-palace-restaurant.jpg"},			{name:"Sava's",image:"https://media-cdn.tripadvisor.com/media/photo-s/15/c7/42/0c/sava-s.jpg"},
		{name:"The Chop House",image:"https://media-cdn.tripadvisor.com/media/photo-s/0a/b5/5e/0b/strip-potatoes-and-delicious.jpg"}
	];
var flash       = require("connect-flash");
var passport    = require("passport"),
    LocalStrategy = require("passport-local");
var Restaurant	= require("./models/restaurant"),
	Comment 	= require("./models/comments"),
    User		= require("./models/users");
var SeedDB		= require("./seeds");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp");


//requring routes
var commentRoutes    = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    indexRoutes      = require("./routes/index")

app.use(express.static(__dirname + "/public"));


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "hey these should be some random words!",
	// turn the password into hash
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// for simplicity to make the first parameter added automatically in front of each route in that file
// app.use("/", indexRoutes);
// app.use("/campgrounds", restaurantRoutes);
// app.use("/campgrounds/:id/comments", commentRoutes);

app.use(indexRoutes);
app.use(restaurantRoutes);
app.use(commentRoutes);


// the order here matters!!
app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("server yelpCamp starts!!!");
});