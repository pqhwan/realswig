

var app = app || {};

(function($) {
	'use strict';
	
	
	app.DriverView = Backbone.View.extend({
		
		tagName : 'div',
		className : 'row',
		
		template : _.template($('#driver-list-template').html()),
		
		events : {
			
		},
		
		initialize : function () {
			console.log("DriverView initialized");
		},
		
		render: function () {
			console.log("driver-view render is called");
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
		
		
	});
	
	
	
})(jQuery);
