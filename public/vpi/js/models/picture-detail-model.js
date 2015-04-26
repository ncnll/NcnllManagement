define(
['jquery', 'lodash', 'backbone'],

function($, _, Backbone) {

    var Picture = Backbone.Model.extend({
    	urlRoot:"/vpi/pictures/detail",
        defaults: {

        },
        parse:function(response){
			return response.picture;
		}
    });

    return Picture;
});
