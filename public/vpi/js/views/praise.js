define(
['jquery', 'lodash', 'backbone', 'utils/tpl'],

function($, _, Backbone, tpl) {

    var PraiseView = Backbone.View.extend({

        initialize: function() {
            this.template = _.template(tpl.get('praise'));
        },

        render: function(eventName) {
            this.$el.html(this.template());
            return this.el;
        },

        events: {
            "click button": "praise"
        },

        praise: function(event) {
            alert("hello");
            //app.navigate("wines/new", true);
            return false;
        }

    });

    return PraiseView;

});