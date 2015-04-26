define(
['jquery', 'lodash', 'backbone', 'models/lesson-model'],

function($, _, Backbone, Lesson) {

	var LessonCollection = Backbone.Collection.extend({
		model: Lesson,
		url: "/vpi/lesson/all",
		parse:function(response){
			return response.rows;
		}
	});

	return LessonCollection;
});