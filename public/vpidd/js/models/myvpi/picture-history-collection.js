define(
['jquery', 'lodash', 'backbone', 'models/myvpi/picture-history-model'],

function($, _, Backbone, MyPicHistory) {

	var PictureHistoryCollection = Backbone.Collection.extend({
		model: MyPicHistory,
		url: "/vpi/pictures/myhistory",
		parse:function(response){
			return response.rows;
		}
	});

	return PictureHistoryCollection;
});
