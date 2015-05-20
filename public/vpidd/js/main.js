require([
    'jquery',
    'lodash',
    'backbone',
    'humane',
    'md5js',
    'utils/spinLoading',
   // 'views/header',
    'views/start',
    'views/lesson-details',
    'views/lesson-list',
    'utils/tpl',
    'utils/humaneNotify',
    'models/lesson-model',
    'models/lesson-collection',
    'models/picture-model',
    'models/picture-collection',
    'models/myvpi/picture-history-collection',
    'views/picture-list',
    "views/myvpi/picture-history-list",
    "views/myvpi/myclasses-list",
    "models/myvpi/myclasses-collection",
    "views/myvpi/header",
    "views/picture-detail",
    "views/upload-pictures",
    "models/picture-detail-model"
],

function($, _, Backbone, humane, md5js, Spinner, StartView, LessonView, LessonListView, tpl,
    humaneNotify, Lesson, LessonCollection, PictureModel, PictureCollection, PicHistoryCollection, PictureListView, PictureHistoryListView,
     MyClassesListView, MyClassCollection, VpiNavHeaderView, PictureView, UploadPicturesView,PictureDetail) {

    Backbone.View.prototype.close = function() {

        if (this.beforeClose) {
            this.beforeClose();
        }
        this.remove();
        this.unbind();
    };


    var MainPageView = Backbone.View.extend({
        render : function(){
            this.$el.html(tpl.get("main-page"));
            return this.el;
        }
    });

     var ContactUsView = Backbone.View.extend({
        render : function(){
            this.$el.html(tpl.get("contact-us"));
            return this.el;
        }
    });

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            new VpiNavHeaderView().render();
            //var target = document.getElementById('logo_head');
            //if(!this.spinner)
            Spinner.spin(Spinner.spinTarget);
        },

        routes: {
            "": "mainPage",
            "contactUs" : "contactUs",
            "lesson/list": "list",
            //"lessons/new": "newLesson",
            "lesson/:id": "lessonDetails",
            "picture/all":"showAllPictures",
            "myvpi/history" : "showMyHistory",
            "myvpi/myclasses" : "showMyClasses",
            "myvpi/uploadPictures" : "uploadPictures",
            "picture/:id": "pictureDetail"
        },
        //Index
        mainPage : function(){
            $("#headerNavBar li").each(function(){
                $(this).removeClass("active");
            });
           /* $("#headerNavBarIndex").attr("class", "active");*/
            var mainPageView = new MainPageView();
            this.showView("#content",mainPageView);
        },
        //Contact Us
        contactUs : function(){
            $("#headerNavBar li").each(function(){
                $(this).removeClass("active");
            });
            $("#headerNavBarContactUs").attr("class", "active");
            var contactUsView = new ContactUsView();
            this.showView("#content",contactUsView);
        },
        //Lesson
        list: function(callback) {

            $("#headerNavBar li").each(function(){
                $(this).removeClass("active");
            });
            $("#headerNavBarTutorial").attr("class", "active");

            this.lessonList = new LessonCollection();
            var self = this;
            this.lessonList.fetch({
                data:{page:1, rows:8},
                type:"POST",
                success: function() {
                    var lessonlist = new LessonListView({
                        model: self.lessonList
                    }).render();
                    //console.log("dddddddddd")
                    $('#content').html(lessonlist);
                    //if (callback) callback.call(self);
                    Spinner.stop();
                }
            });
        },

        lessonDetails: function(id) {
           //alert("hello"+id)
           //$("#detailModelDiv").parent().remove();
           // var lessonId = $(ev.currentTarget).data("lessonid");
            Spinner.spin(Spinner.spinTarget);
            this.lesson = new Lesson();
            var that = this;
            this.lesson.fetch({
                data:{"_id":id},
                type:"POST",
                success:function(result){
                    if(result.get("success")==false){
                        humaneNotify.log(result.get("msg"));
                        that.navigate('#lesson/list');
                        Spinner.stop();
                    }else{
                        var lessonDetailView = new LessonView({model:that.lesson});
                        //$("#content").html(lessonDetailView);
                        that.showView("#content", lessonDetailView);
                        //$("#detailModelDiv").modal({backdrop:"static", show:true});
                        Spinner.stop();
                    }
                    //var praiseView = new PraiseView().render();
                    //$(itemView).find(".lessonListItemContent").append(praiseView);

                }
            });
        },
        //图片详细
        pictureDetail : function(id){
            //alert("hello"+id)
           //$("#detailModelDiv").parent().remove();
           // var lessonId = $(ev.currentTarget).data("lessonid");
            Spinner.spin(Spinner.spinTarget);
            this.picture = new PictureDetail();
            var that = this;
            this.picture.fetch({
                data:{"_id":id},
                type:"POST",
                success:function(result){
                    if(result.get("success")==false){
                        humaneNotify.log(result.get("msg"));
                        that.navigate('#picutre/all');
                        Spinner.stop();
                    }else{
                        var pictureDetailView = new PictureView({model:that.picture});
                        //$("#content").html(lessonDetailView);
                        that.showView("#content", pictureDetailView);
                        //$("#detailModelDiv").modal({backdrop:"static", show:true});
                        Spinner.stop();
                    }
                    //var praiseView = new PraiseView().render();
                    //$(itemView).find(".lessonListItemContent").append(praiseView);

                }
            });
        },

        //Show all pictures
        showAllPictures : function(){
            Spinner.spin(Spinner.spinTarget);

            $("#headerNavBar li").each(function(){
                $(this).removeClass("active");
            });
            $("#headerNavBarPicture").attr("class", "active");

            this.pictureCollection = new PictureCollection();
            var self = this;

            this.pictureCollection.fetch({
                data:{page:1, rows:8, status:1},
                type:"POST",
                success:function(){
                    var pictureListView = new PictureListView({
                        model : self.pictureCollection
                    });
                    self.showView("#content", pictureListView);
                    Spinner.stop();
                }
            });
        },


        /******我的微拍*******/
        //我的上传历史
        showMyHistory : function(){
            Spinner.spin(Spinner.spinTarget);

            this.pictureHistoryCollection = new PicHistoryCollection();
            var self = this;
            this.pictureHistoryCollection.fetch({
                data:{page:1, rows:8},
                type:"POST",
                success:function(){
                    var pictureHistoryListView = new PictureHistoryListView({
                        model:self.pictureHistoryCollection
                    });
                   // console.log(pictureHistoryListView.el)
                    self.showView("#content", pictureHistoryListView);
                    Spinner.stop();
                }
            });
        },

        //我的课程
        showMyClasses : function(){
            this.classCollection = new MyClassCollection();
            var self = this;
            Spinner.spin(Spinner.spinTarget);
            $.post("/vpi/userSessionInfo", {}, function(result){
                if(result._id)
                self.classCollection.fetch({
                    data : {
                        student : result._id
                    },
                    type:"POST",
                    success : function(){
                        var myclassesView = new MyClassesListView({
                            model : self.classCollection
                        });
                        //console.log(myclassesView.render())
                        //var classView = myclassesView.render();
                        self.showView("#content", myclassesView);
                        Spinner.stop();
                    }
                });
           });
        },
        //传图
        uploadPictures : function(){
            $("#headerNavBar li").each(function(){
                $(this).removeClass("active");
            });
            $("#headerNavBarUploadPicture").attr("class", "active");

            var uploadPictures = new UploadPicturesView();
            this.showView("#content", uploadPictures);
        },

        /*newLesson: function() {
            this.before(function() {
                this.showView('#content', new LessonView({
                    model: new Lesson()
                }));
            });
        },*/

        showView : function(selector, view) {
            if (this.currentView) this.currentView.close();

            $(selector).html( view.render() );
            this.currentView = view;

            return view;
        },

        before: function(callback) {

        }

    });


    Spinner.spin(Spinner.spinTarget);
    var self = this;
    tpl.loadTemplates([ 'header', 'lesson-details', 'lesson-list-item', 'lesson-homework-upload-modal', 'start',
                        'picture-list-item', 'picture-list-item-detail', 'myvpi/history-list-container',
                        'myvpi/history-list-item', 'myvpi/myclass-item', 'myvpi/header', 'myvpi/login-modal',
                        'myvpi/myclass-container', 'myvpi/register-modal', 'myvpi/changepwd-modal', 'myvpi/header-logined',
                        'upload-pictures', 'upload-pictures-item', 'main-page','contact-us', 'picture-detail'], function() {
        window.app = new AppRouter();
        Backbone.history.start();
        Spinner.stop();
    });

}); // End require
