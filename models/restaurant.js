var mongoose = require("mongoose");

//Schema Setup
var restaurantSchema = new mongoose.Schema({
	name:String,
	image:String,
	price:String,
	description:String,
	author:{
		id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment" 
		  // ref is the name of the model 
		  // association done
      }
   ]
});
module.exports = mongoose.model("Restaurant",restaurantSchema);

