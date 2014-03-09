

var app = app || {};

(function($) {
	'use strict';
	
	app.AppView = Backbone.View.extend({
		
		el : '#driversList',
		
		
		initialize : function () {
			console.log("AppView initialized");
			this.addAll();
		},
		
		render : function () {
			console.log("appView is rendering");
		},
		
		addOne : function (driver) {
			console.log("in addOne function");
			var view = new app.DriverView({model : driver});
			this.$el.append(view.render().el);
		},
		
		addAll : function () {
			console.log("In addAll() function");
			app.driverCollection.each(this.addOne, this);
		}
		
		
	});
	
	
	
})(jQuery);
