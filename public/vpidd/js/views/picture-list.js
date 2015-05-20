define(
['jquery', 'lodash', 'backbone', 'utils/tpl', 'models/picture-collection','models/picture-model',  'utils/spinLoading', 'views/praise', 'bootstrap'],

function($, _, Backbone, tpl, PictureCollection, Picture, Spinner, PraiseView) {

    var PictureListView = Backbone.View.extend({

        //tagName: 'ul',
        initialize: function() {
            this.$el.attr("class","row");
            //this.model.view = this;
            //this.model.bind("reset", this.render, this);
            //this.model.bind("add", this.appendNewPicture, this);
        },

        render: function(eventName) {
            if(this.model.models.length > 0 ){
                 _.each(this.model.models, function(picture) {
                    this.appendNewPicture(picture);
                }, this);
                this.$el.append($('<div style="text-align:center;clear:both;"><ul class="pager" data-currentPage="2"><li class="pagerLi"><a href="javascript:void(0)">更多&gt;&gt;</a></li></ul></div>'));
            }else{
                this.$el.append($('<div style="text-align:center;clear:both;"><ul><li><a href="javascript:void(0);">没有更多！</a></li></ul></div>'));
            }

            return this.el;
        },

        events: {
            "click .pagerLi" : "loadPicturesInNextPage"
        },

        loadPicturesInNextPage : function(ev){
            var currentPage = parseInt($(".pager").attr('data-currentPage'));
            $(".pager").parent().remove();
            var self = this;
            this.pictureList = new PictureCollection();
            Spinner.spin(Spinner.spinTarget);
            this.pictureList.fetch({
                data:{page:currentPage, rows:8, status:1},
                type:"POST",
                success: function() {
                    var picturelist = new PictureListView({
                        model: self.pictureList
                    }).render();
                    $('#content').append(picturelist);
                    $(".pager").attr("data-currentPage", currentPage+1);
                    Spinner.stop();
                }
            });
        },
        appendNewPicture: function(picture) {

            var itemView = new PictureListItemView({
                model: picture
            }).render();
            //var praiseView = new PraiseView().render();
            //$(itemView).find(".pictureListItemContent").append(praiseView);
            this.$el.append(itemView);
        }
    });

    var PictureListItemView = Backbone.View.extend({

        //tagName: "li",

        initialize: function() {
            this.$el.attr("class", "col-sm-6 col-md-3");
            this.template = _.template(tpl.get('picture-list-item'));
            this.model.bind("destroy", this.close, this);
        },

        events:{
            "click img" : "showPictureDetailss"
        },

        showPictureDetailss: function(){
             var self = this;
           var pictureListItemDetailView = new PictureListItemDetailView({
             model : self.model
           }).render();
           $("body").append(pictureListItemDetailView);
           $("#detailPictureItemDiv").modal({backdrop:"static", show:true});
          // console.log(pictureListItemDetailView);
        },

        render: function(eventName) {
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }

    });


    var PictureListItemDetailView = Backbone.View.extend({
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

    return PictureListView;

});
