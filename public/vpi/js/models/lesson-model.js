define(
['jquery', 'lodash', 'backbone'],

function($, _, Backbone) {

    var Lesson = Backbone.Model.extend({
        urlRoot: "/vpi/lesson/detail/",
        parse : function(response) {
            if(response.lessonDetail){
                return response.lessonDetail;
            }else{
                return response;
            }
          
        },
        defaults: {
            
        }
    });

    return Lesson;
});