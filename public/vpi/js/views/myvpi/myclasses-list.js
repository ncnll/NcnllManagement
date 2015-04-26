define(
['jquery', 'lodash', 'backbone', 'utils/tpl', 'models/myvpi/myclasses-collection','models/myvpi/myclass-model',
 'spin', 'views/praise', 'bootstrap'],

function($, _, Backbone, tpl, ClassCollection, Class, Spinner, PraiseView) {

    var MyClassesListView = Backbone.View.extend({

        //tagName: 'ul',
        initialize: function() {
            //this.$el.attr("class","row");
            this.$el.html(tpl.get('myvpi/myclass-container'));
            var self = this;
            $.post("/vpi/classType/all", {}, function(result){
                //console.log(result);
                var optionHtml = "";
                self.allClassType = result.rows;
                for(var i in result.rows){
                    optionHtml+="<option value='"+result.rows[i]._id+"'>"+result.rows[i].name+"</option>";
                }
                $("#classTypeSelector").html("").append(optionHtml);
                //console.log(result.rows[0]._id);
                $("#classTypeSelector").val(result.rows[0]._id);
                $("#classTypeSelector").trigger("change");
            }).error(function(){

            });
            //this.model.view = this;
            //this.model.bind("reset", this.render, this);
            //this.model.bind("add", this.appendNewClass, this);
        },

        events : {

            "click #applyClassBtn" : "applyClass",
            "change #classTypeSelector" : "loadClassDetail",
            "click #submitApplyBtn" : "submitApply"
        },
        loadClassDetail : function(){
            //alert($("#classTypeSelector").val());
            for(var i  in this.allClassType){
                if(this.allClassType[i]._id == $("#classTypeSelector").val()){
                    $("#applyClassContentDiv").text(this.allClassType[i].description);
                    //$("#classTypeTimeSpan").text(new Date(this.allClassType[i].createDate).format("yyyy-mm-dd HH:MM:ss"));
                }
            }
        },
        submitApply:function(){
            $.post("/vpi/student/applyForClass", {classType:$("#classTypeSelector").val()}, function(result){
                $("#applyClassModal").modal("hide");
                setTimeout(function(){
                    Backbone.history.loadUrl();
                }, 500);

            });
        },
        applyClass : function(){
            $("#applyClassModal").modal({backdrop:"static", show:true});
        },

        render: function(eventName) {
            //this.$el.html(tpl.get("myvpi/history-list-container"));
            this.appendClasses(this.model);
            return this.el;
        },
        appendClasses: function(model){
            _.each(model.models, function(myClass) {
                switch(myClass.get("status")){
                    case 0 :
                        myClass.set("statusString", "课程申请中");
                        break;
                    case 1 :
                        myClass.set("statusString", "申请通过");
                        break;
                    case 2 :
                        myClass.set("statusString", "申请被拒绝");
                        break;
                }

                //myClass.set("createDate" , new Date(myClass.get("classType").createDate).format("yyyy-mm-dd HH:MM:ss"));
                this.appendNewClass(myClass);
            }, this);
        },
        appendNewClass: function(myClass) {

            var itemView = new MyclassesListItemView({
                model: myClass
            }).render();
            //var praiseView = new PraiseView().render();
            //$(itemView).find(".myClassHistoryListItemContent").append(praiseView);
            //console.log(this.$el.find("#myClassHistoryContainer"))
            this.$el.find("#myClassesContainer").append(itemView);
            return this.el;
        }
    });

    var MyclassesListItemView = Backbone.View.extend({

        tagName: "tr",

        initialize: function() {
            this.template = _.template(tpl.get('myvpi/myclass-item'));
            this.model.bind("destroy", this.close, this);
        },

        events:{
            "click img" : "showClassDetail",
            "click .cancelLessonBtn" : "cancelLesson"
        },
        cancelLesson : function(){
             $.post("/vpi/student/withdrawClass", { "classType":this.model.get("classType")._id, "class":this.model.get("class")}, function(result){
                Backbone.history.loadUrl();
             }); 
        },
        showClassDetail: function(){
           var self = this;
           var myClassHistoryListItemDetailView = new MyclassesListItemDetailView({
             model : self.model
           }).render();
           $("body").append(myClassHistoryListItemDetailView);
           $("#detailClassItemDiv").modal({backdrop:"static", show:true});
          // console.log(myClassHistoryListItemDetailView);
        },

        render: function(eventName) {
            //console.log(this.model.toJSON())
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.find("td").css("vertical-align", "middle");
            return this.el;
        }

    });


    var MyclassesListItemDetailView = Backbone.View.extend({
        initialize : function(){
            if($("#detailClassItemDiv")){
                $("#detailClassItemDiv").parent().remove();
            }
            this.template = _.template(tpl.get("myClass-list-item-detail"));
        },
        events : {

        },

        applyClass : function(){

        },
        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });

    return MyClassesListView;

});
