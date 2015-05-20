define(
['jquery', 'lodash', 'backbone', 'humane','utils/tpl'],

function($, _, Backbone, Humane, tpl) {

    var LessonView = Backbone.View.extend({


        //tagName: "div",
        // Not required since 'div' is the default if no el or tagName specified
        initialize: function() {

            this.template = _.template(tpl.get('lesson-homework-upload'));
           // this.model.bind("change", this.render, this);

        },

        render: function(eventName) {
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        },

        events: {
            "change input": "change"
        },

        change: function(event) {
            var target = event.target;
            //console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        },
        praiseLesson:function(ev){

           // var $btn = this.$el.button('提交赞...')
            /*var that = this;
            var id = $(ev.currentTarget).data("lessonid");
            $.post("/vpi/lesson/praise/",{_id:id}, function(result){
                if(result.success){
                    that.$el.find(".praiseCountBadage").text(result.praiseCount);
                }else{
                    var notify = Humane.create({ timeout: 4000, baseCls: 'humane-bigbox' })
                    notify.log(result.msg);
                }   
            });*/
        },
        shareThisLesson: function(ev){
            alert("shareThisLesson")
        },
        saveLesson: function() {
            this.model.set({
                name: $('#name').val(),
                grapes: $('#grapes').val(),
                country: $('#country').val(),
                region: $('#region').val(),
                year: $('#year').val(),
                description: $('#description').val()
            });
            if (this.model.isNew()) {
                var self = this;
                app.lessonList.create(this.model, {
                    success: function() {
                        app.navigate('lessons/' + self.model.id, false);
                    }
                });
            } else {
                this.model.save();
            }

            return false;
        },

        deleteLesson: function() {
            this.model.destroy({
                success: function() {
                    alert('Lesson deleted successfully');
                    window.history.back();
                }
            });
            return false;
        }

    });

    return LessonView;

});