define(
['jquery', 'lodash', 'backbone', 'utils/tpl', 'models/lesson-collection','models/lesson-model', 'views/lesson-details', 'spin', 'views/praise', 'bootstrap'],

function($, _, Backbone, tpl, LessonCollection, Lesson, LessonDetailView, Spinner, PraiseView) {

    var LessonListView = Backbone.View.extend({

        //tagName: 'ul',
        initialize: function() {
            this.$el.attr("class","row");
            //this.model.view = this;
            //this.model.bind("reset", this.render, this);
            //this.model.bind("add", this.appendNewLesson, this);
        },

        render: function(eventName) {
            if(this.model.models.length > 0 ){
                 _.each(this.model.models, function(lesson) {
                    
                    this.appendNewLesson(lesson);
                }, this);
                this.$el.append($('<div style="text-align:center;clear:both;"><ul class="pager" data-currentPage="2"><li class="pagerLi"><a href="javascript:void(0)">更多&gt;&gt;</a></li></ul></div>'));
            }else{
                this.$el.append($('<div style="text-align:center;clear:both;"><ul><li><a href="javascript:void(0);">没有更多！</a></li></ul></div>'));
            }
           
            return this.el;
        },

        events: {
            "click .pagerLi" : "loadLessonsInNextPage"
        },

        loadLessonsInNextPage : function(ev){
            var currentPage = parseInt($(".pager").attr('data-currentPage'));
            $(".pager").parent().remove();
            var self = this;
            this.lessonList = new LessonCollection();
            var target = document.getElementById('htmlBody');
            var spinner = new Spinner().spin(target);
            this.lessonList.fetch({
                data:{page:currentPage, rows:8},
                type:"POST",
                success: function() {
                    var lessonlist = new LessonListView({
                        model: self.lessonList
                    }).render();
                    $('#content').append(lessonlist);
                    $(".pager").attr("data-currentPage", currentPage+1);
                    spinner.stop();
                }
            });
        },
        appendNewLesson: function(lesson) {
           
            var itemView = new LessonListItemView({
                model: lesson
            }).render();
            //var praiseView = new PraiseView().render();
            //$(itemView).find(".lessonListItemContent").append(praiseView);
            this.$el.append(itemView);
        }
    });

    var LessonListItemView = Backbone.View.extend({

        //tagName: "li",

        initialize: function() {
            this.$el.attr("class", "col-xs-12 col-lg-6");
            this.template = _.template(tpl.get('lesson-list-item'));
            this.model.bind("change", this.render, this);
            this.model.bind("destroy", this.close, this);
        },

        events:{
            //"click img":"showLessonDetail"
        },

        showLessonDetail : function(ev){
            /*$("#detailModelDiv").parent().remove();
            var lessonId = $(ev.currentTarget).data("lessonid");
            this.lesson = new Lesson();
            var that = this;
            this.lesson.fetch({
                data:{"_id":lessonId}, 
                type:"POST",
                success:function(result){
                    //var praiseView = new PraiseView().render();
                    //$(itemView).find(".lessonListItemContent").append(praiseView);
                    var lessonDetailView = new LessonDetailView({model:that.lesson}).render();
                    $("body").append(lessonDetailView);
                    $("#detailModelDiv").modal({backdrop:"static", show:true});
                }
            });*/
        },
        render: function(eventName) {
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }

    });

    return LessonListView;

});