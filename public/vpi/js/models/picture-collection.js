define(
['jquery', 'lodash', 'backbone', 'models/picture-model'],

function($, _, Backbone, Picture) {

	var PictureCollection = Backbone.Collection.extend({
		model: Picture,
		url: "/vpi/pictures/show",
		parse:function(response){
			return response.rows;
		}
	});

	return PictureCollection;
});
