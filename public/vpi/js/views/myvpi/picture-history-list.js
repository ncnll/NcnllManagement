define(
['jquery', 'lodash', 'backbone', 'utils/tpl', 'models/picture-collection','utils/humaneNotify', 'models/picture-model', 'spin', 'views/praise', 'bootstrap'],

function($, _, Backbone, tpl, PictureCollection, humaneNotify, Picture, Spinner, PraiseView) {

    var PictureHistoryListView = Backbone.View.extend({

        //tagName: 'ul',
        initialize: function() {
            //this.$el.attr("class","row");
            //this.model.view = this;
            //this.model.bind("reset", this.render, this);
            //this.model.bind("add", this.appendNewPicture, this);
        },

        render: function(eventName) {
            this.$el.html(tpl.get("myvpi/history-list-container"));
            this.appendPictures(this.model);
            return this.el;
        },

        events: {
            "click .pagerLi" : "loadPicturesInNextPage"
        },

        loadPicturesInNextPage : function(ev){

            var currentPage = parseInt($(".pager").attr('data-currentPage'));
            $(".pager").parent().remove();
            var self = this;
            this.pictureHistoryList = new PicHistoryCollection();
            var target = document.getElementById('htmlBody');
            var spinner = new Spinner().spin(target);
            this.pictureHistoryList.fetch({
                data:{page:currentPage, rows:8, user:$("#userId").val()},
                type:"POST",
                success: function() {
                    self.appendPictures(self.pictureHistoryList);
                   // $("#pictureHistoryContainer").append(picturelist);
                    $(".pager").attr("data-currentPage", currentPage+1);
                    spinner.stop();
                }
            });
        },
        appendPictures: function(model){

            if(model.models.length > 0 ){


                 _.each(model.models, function(picture) {
                    if(!picture.get("lesson")){
                        picture.set("lesson", {title:"免费"});
                    }
                    switch(picture.get("status")){
                        case 0:
                            picture.set("status","未审核");
                            break;
                        case 1:
                            picture.set("status","可展示");
                            break;
                        case 2:
                            picture.set("status","不可展示");
                            break;

                    }

                   //picture.set("createDate", new Date(picture.get("createDate")).format("yyyy-mm-dd HH:MM:ss"));
                   this.appendNewPicture(picture);
                   //console.log()
                }, this);
                this.$el.append($('<div style="text-align:center;clear:both;"><ul class="pager" data-currentPage="2"><li class="pagerLi"><a href="javascript:void(0)">更多&gt;&gt;</a></li></ul></div>'));
            }else{
                this.$el.append($('<div style="text-align:center;clear:both;"><ul style="list-style:none;"><li><a href="javascript:void(0);">没有更多！</a></li></ul></div>'));
            }
        },
        appendNewPicture: function(picture) {

            var itemView = new PictureHistoryListItemView({
                model: picture
            }).render();
            //var praiseView = new PraiseView().render();
            //$(itemView).find(".pictureHistoryListItemContent").append(praiseView);
            //console.log(this.$el.find("#pictureHistoryContainer"))
            this.$el.find("#pictureHistoryContainer").append(itemView);
            //return this.el;
        }
    });

    var PictureHistoryListItemView = Backbone.View.extend({

        tagName: "tr",

        initialize: function() {

            this.template = _.template(tpl.get('myvpi/history-list-item'));
            this.model.bind("destroy", this.close, this);
        },

        events:{
            "click img" : "showPictureDetail",
            "click .delHistoryPictureBtn" : "delHistoryPicture"
        },
        delHistoryPicture:function(){
            $.post("/vpi/pictures/delete", {_id:this.model.get("_id")}, function(result){
                if(result.success){
                    humaneNotify.error = humaneNotify.spawn({ addnCls: 'humane-libnotify-error', timeout: 600 });
                    humaneNotify.error('删除成功');
                    Backbone.history.loadUrl();
                }else{
                    humaneNotify.log("删除失败");
                }
            });
        },
        showPictureDetail: function(){
           var self = this;
           var pictureHistoryListItemDetailView = new PictureHistoryListItemDetailView({
             model : self.model
           }).render();
           $("body").append(pictureHistoryListItemDetailView);
           $("#detailPictureItemDiv").modal({backdrop:"static", show:true});
          // console.log(pictureHistoryListItemDetailView);
        },

        render: function(eventName) {
            //console.log(this.model.toJSON())
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.find("td").css("vertical-align", "middle");
            return this.el;
        }

    });


    var PictureHistoryListItemDetailView = Backbone.View.extend({
        initialize : function(){
            if($("#detailPictureItemDiv")){
                $("#detailPictureItemDiv").parent().remove();
            }
            this.template = _.template(tpl.get("picture-list-item-detail"));
        },
        events : function(){

        },
        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });

    return PictureHistoryListView;

});
