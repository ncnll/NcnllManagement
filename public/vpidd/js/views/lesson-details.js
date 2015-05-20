define(
['jquery', 'lodash', 'backbone', 'utils/humaneNotify', 'utils/spinLoading', 'utils/tpl', 'iframeTransport' , 'uiWidget', 'fileupload'],

function($, _, Backbone, humaneNotify, Spinner, tpl) {


    var LessonHomeworkUploadModalView = Backbone.View.extend({
        initialize: function(){
            this.template = _.template(tpl.get('lesson-homework-upload-modal'));
        },
        render : function(data){
            this.$el.html(this.template(this.model));
            return this.el;
        },
        events : {
            "click .saveFilesBtn":"saveLessonHomework"
        },

        saveLessonHomework : function(){
            Spinner.spin(Spinner.spinTarget);
            this.model.name = $("#homeworkName").val();
            this.model.description = $("#homeworkDescription").val();
            this.model.status = 0;
            if( !this.model.name ||  this.model.name=="" || !this.model.description || this.model.description==""){
                humaneNotify.log("请填写标题与描述！");
                Spinner.stop();
                return;
            }
            $.post("/vpi/pictures/add", this.model, function(result){
                if(result.success){
                    humaneNotify.log("提交成功！");
                    $('#detailModelDiv').modal('hide');
                }

            }).fail(function() {
                humaneNotify.log("提交失败");
              })
              .always(function() {
               Spinner.stop();
            });
        }
    });

    var LessonView = Backbone.View.extend({

        //tagName: "div",
        // Not required since 'div' is the default if no el or tagName specified
        initialize: function() {

            this.template = _.template(tpl.get('lesson-details'));

        },

        render: function(eventName) {
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        },

        events: {
            "change input": "change",
            "click .praiseBtn": "praiseLesson",
            "click #fileupload":"uploadHomeworks",
            "click .shareBtn":"shareThisLesson"
        },

        change: function(event) {
            var target = event.target;
        },
        praiseLesson:function(ev){
            // var $btn = this.$el.button('提交赞...')
            var that = this;

            $.post("/vpi/lesson/praise/",{_id:id}, function(result){
                if(result.success){
                    that.$el.find(".praiseCountBadage").text(result.praiseCount);
                }else{
                    //var notify = Humane.create({ timeout: 4000, baseCls: 'humane-original' })
                    humaneNotify.log(result.msg);
                }
            });
        },

        uploadHomeworks : function(ev){
            console.log($(ev.currentTarget).data("lessonid"));
             // this.model.bind("change", this.render, this);
            $('#fileupload').fileupload({
               // dataType: 'json',
                add: function (e, data) {
                    Spinner.spin(Spinner.spinTarget);
                    data.submit();
                },
                submit: function(e, data){
                    data.formData = {isbrowser: true};
                },
                done: function (e, data) {
                    //var notify = Humane.create({ timeout: 4000, baseCls: 'humane-original' })
                    var picName;
                     if(typeof data.result == "string"){
                         picName = data.result;
                        if(picName=="authFalse"){
                            humaneNotify.log('图片上传失败，请先登录！');
                            return;
                        }

                    }else{
                         picName =data.result.name;
                        //picName = data.result[0].body.innerHTML;
                        if(picName=="authFalse"){
                            humaneNotify.log('图片上传失败，请先登录！');
                            return;
                        }
                    }
                    humaneNotify.log('图片上传成功,请继续保存！');


                    /*if(typeof data.result == "string"){
                        picName = data.result;
                    }else{
                        picName = data.result[0].body.innerHTML;
                    }*/
                    $("#detailModelDiv").remove();
                    console.log($(ev.currentTarget).data("lessonid"));
                    var lessonHomeworkUploadModalView = new LessonHomeworkUploadModalView({
                        model:{
                                    uris:"['"+picName+"']",
                                    uri:picName,
                                    lesson : $('#btn-praise').attr("data-lessonid")
                              }
                    });
                    var lessonHomeworkUploadModalViewEl = lessonHomeworkUploadModalView.render();
                    $("body").append(lessonHomeworkUploadModalViewEl);
                    $("#detailModelDiv").modal({backdrop:"static", show:true});

                    Spinner.stop();

                },


                complete : function(result, textStatus, jqXHR){
                   // var hello = result.success();
                    Spinner.stop();
                    $('#uploadProgressPercentage').html("100%");

                }
            });
            //$("#fileupload").trigger("click");

            //$("#detailModelDiv").modal({backdrop:"static", show:true});
        },
        shareThisLesson: function(ev){
            alert("shareThisLesson");
        }

    });

    return LessonView;

});
