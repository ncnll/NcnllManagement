define(
['jquery', 'lodash', 'backbone', 'utils/humaneNotify', 'utils/spinLoading', 'utils/tpl'],

function($, _, Backbone, humaneNotify, Spinner, tpl) {


    var PictureView = Backbone.View.extend({

        //tagName: "div",
        // Not required since 'div' is the default if no el or tagName specified
        initialize: function() {

            this.template = _.template(tpl.get('picture-detail'));

        },

        render: function(eventName) {
            console.log(this.model.toJSON())
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }

    });

    return PictureView;

});
