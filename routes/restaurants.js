var express = require("express");
var router  = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");


// INDEX ROUTE
router.get("/restaurants",function(req,res){
	Restaurant.find({},function(err,allRestaurant){
		if(err){
			console.log("something went wrong!");
		}
		else{
		res.render("restaurants/index",{restaurants:allRestaurant});
}
	});
});

//NEW ROUTE
router.get("/restaurants/new",middleware.isLoggedIn,function(req,res){
	res.render("restaurants/new");
});

//CREATE ROUTE
// the campgrounds of post is different from the get route; rest - a convention we should follow
router.post("/restaurants",middleware.isLoggedIn,function(req,res){
	// get data from the form and add it to the campgrounds array
	var name = req.body.restaurant;
	var img = req.body.image;
	var dsc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,username: req.user.username
	};
	var newCampGround = {name:name,image:img,description:dsc,author:author,price:price};
	console.log(newCampGround);
	//create a new restaurant and save it to db
		 Restaurant.create(
			newCampGround,function(err,restaurant){
		 		 if(err){
		 			 console.log(err);
					 req.flash("error", "Something went wrong");
		 		 }  
		 		else{
		 		// redirect it back to the restaurants page
					console.log(restaurant);
					req.flash("success", "Successfully added comment");
					res.redirect("/restaurants");
		 		}
		 		   });
	//campgrounds.push(newCampGround);
});

//SHOW ROUTE
router.get("/restaurants/:id",function(req,res){
	Restaurant.findById(req.params.id).populate("comments").exec(function(err,foundRestaurant){
		if(err){
			console.log(err);
		}
		else{
			res.render("restaurants/show",{restaurant:foundRestaurant});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/restaurants/:id/edit",middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/restaurants/:id", middleware.checkRestaurantOwnership,function(req, res){
    // find and update the correct campground
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
       if(err){
           res.redirect("/restaurants");
       } else {
           //redirect somewhere(show page)
           res.redirect("/restaurants/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/restaurants/:id",middleware.checkRestaurantOwnership, function(req, res){
   Restaurant.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/restaurants");
      } else {
		  req.flash("success", "Comment deleted");
          res.redirect("/restaurants");
      }
   });
});



module.exports = router;

