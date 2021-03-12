var middlewareObj = {};
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comments");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkRestaurantOwnership = function(req, res, next) {

 if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
           if(err){
               res.redirect("back");
			   req.flash("error", "Restaurant not found");
           }  else {
               // does user own the campground?
            if(foundRestaurant.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
	 //make sure user is logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


module.exports = middlewareObj;