define(
['jquery', 'lodash', 'backbone', 'utils/humaneNotify', 'utils/spinLoading', 'utils/tpl', 'iframeTransport' , 'uiWidget', 'fileupload'],

function($, _, Backbone, humaneNotify, Spinner, tpl) {

    var uploadPictureView = Backbone.View.extend({

        //tagName: "div",
        // Not required since 'div' is the default if no el or tagName specified
        initialize: function() {


        },

        render: function(eventName) {
            //tpl.loadTemplates(['upload-pictures'], function(){
                this.template = _.template(tpl.get('upload-pictures'));


            this.$el.html(this.template({}));
            return this.el;
        },

        events: {
            "click .save": "savePictures",
            "click #fileupload":"uploadPicture",
            "click .deleteUploadedFilesBtn" : "deleteUploadedFiles",
            "click #uploadSelectedPicturesBtn" : "uploadSelectedPictures"
        },

        change: function(event) {
            var target = event.target;
        },

        uploadSelectedPictures : function(){
            if($(".uploadedImageThumbnail").length<1){
                humaneNotify.log("请先添加作品后再提交！");
                return;
            }
            var isCompleted=true;
            $(".uploadedImageThumbnail").each(function(){
                var picName=$(this).find(".imageTitle")[0].value;
                var picDescription=$(this).find(".imageDescription")[0].value;
                if(!picName || picName=="" || !picDescription || picDescription==""){
                    humaneNotify.log("请填写图片标题与描述！");
                    isCompleted=false;
                    return;
                }
            });
            if(!isCompleted){
                return;
            }
            $(".uploadedImageThumbnail").each(function(){
                var self = this;
                Spinner.spin(Spinner.spinTarget);
                $.post("/vpi/pictures/add",
                    {
                        name:$(this).find(".imageTitle")[0].value,
                        description:$(this).find(".imageDescription")[0].value,
                        uris:"[\""+ $(this).find("img:first").attr("data-nameuri")+ "\"]"
                    }, function(result){
                        var notify = humaneNotify.create({ timeout: 1000, baseCls: 'humane-original' })
                        notify.log($(self).find(".imageTitle")[0].value+'上传成功');
                        $(self).fadeOut("slow");
                        setTimeout(function(){
                            $(self).parent().parent().remove();
                        }, 1000);

                        Spinner.stop();

                    });
                //console.log( $(this).find(".imageDescription")[0].value );
            });
        },

        uploadPicture : function(ev){

             // this.model.bind("change", this.render, this);
            $('#fileupload').fileupload({
               // dataType: 'json',
                add: function (e, data) {
                   /* var target = document.getElementById('htmlBody');
                    spinner = new Spinner().spin(target);*/
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
                      //  picName = data.result[0].body.innerHTML;
                        if(picName=="authFalse"){
                            humaneNotify.log('图片上传失败，请先登录！');
                            return;
                        }
                    }
                    humaneNotify.log('图片上传成功');

                    var pictureItem =  new PictureItemView({
                        model : {picName : picName}
                    });
                    $("#pictureItemsDiv").append(pictureItem.render());
                   /* if(spinner){
                        Spinner.stop();
                    }*/
                    Spinner.stop();

                },


                complete : function(result, textStatus, jqXHR){
                    var hello = result.success();

                        Spinner.stop();
                        $('#uploadProgressPercentage').html("100%");


                }
            });
            //$("#fileupload").trigger("click");

            //$("#detailModelDiv").modal({backdrop:"static", show:true});
        },

        savePictures: function() {
            alert("OK")
        },


        deleteUploadedFiles: function() {
            alert("hello")
            return false;
        }

    });


    var PictureItemView = Backbone.View.extend({
        render : function(){

            this.template =_.template(tpl.get("upload-pictures-item"))

            this.$el.html(this.template(this.model));

            return this.el;
        },
        events : {
            "click button" : function(){
                this.close();
            }
        }
    });

    return uploadPictureView;

});
