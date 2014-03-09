

var app = app || {};

(function () {
	
	var DriverCollection = Backbone.Collection.extend({
		
		model : app.Driver,
		
		initialize : function () {
			console.log("Collection initialized");
		}
		
		
	});
	
	
	app.driverCollection = new DriverCollection([
	  {
	  	driver_pic: "assets/images/icon-original_64x64x32.png", 
	  	driver_name: "Mani Askari",
	  	driver_distance_mi : "3"
	  },
	  {
	  	driver_pic: "assets/images/icon-original_64x64x32.png", 
	  	driver_name: "Peter JSON",
	  	driver_distance_mi : "10"
	  },
	 
	]);
	
})();
