define(
['jquery', 'lodash', 'backbone', 'utils/tpl', 'utils/spinLoading', 'utils/humaneNotify', 'views/praise', 'md5js', 'bootstrap'],

function($, _, Backbone, tpl, Spinner, humaneNotify, PraiseView, md5js) {

    var MyVpiHeaderView = Backbone.View.extend({

        //tagName: 'ul',
        initialize: function() {
           this.$el.attr("class", "headerLoginStatusDiv");
        },

        render: function(eventName) {

           var self = this;
           $.post("/vpi/userSessionInfo", {}, function(result){
                $(".headerLoginStatusDiv").remove();
                if(result._id){
                    $('#header-nav-collapse').append(self.$el.html(tpl.get("myvpi/header-logined")));
                    $("#userNameSpan").text(result.username);
                    $("#userId").val(result._id);

                }else{
                    $('#header-nav-collapse').append(self.$el.html(tpl.get("myvpi/header")));
                }
           });
        },

        events: {
            "click #loginBtnLink" : "openLoginModal",
            "click #changePwdBtnLink" : "openChangePwdModal",
            "click #userLogoutBtn" : "userLogout",
            "click .logoutSure" : "logoutSure"
        },
        userLogout:function(){
            $("#logoutConfirmModal").modal({backdrop:"static", show:true});
        },
        logoutSure : function(){
            var self = this;
            $.post("/vpi/logout",function(result){
                $("#logoutConfirmModal").modal("hide");
                humaneNotify.log("退出成功！");
                //
                setTimeout(function(){
                    new MyVpiHeaderView().render();
                    self.close();
                },500);
            });
        },
        openLoginModal : function(){
            if(this.loginModalView){
                this.loginModalView.close();
            }

            this.loginModalView = new LoginModalView();
            $("body").append(this.loginModalView.render());
            $("#loginModal").modal({backdrop:"static", show:true});
        },

        openChangePwdModal : function(){
            if(this.changePwdModalView){
                this.changePwdModalView.close();
            }

            this.changePwdModalView = new ChangePwdModalView();
            $("body").append(this.changePwdModalView.render());
            $("#changePwdModal").modal({backdrop:"static", show:true});

        }
    });

    var ChangePwdModalView = Backbone.View.extend({
        render : function(){
            this.$el.html(tpl.get("myvpi/changepwd-modal"));
            return this.el;
        },
        events : {
            "click #submitFormInputBtn" : "changePassword"
        },
        changePassword: function(event){
            event.preventDefault();
            if($("#newPassword2").val()!=$("#newPassword1").val()){
                humaneNotify.log("新密码不一致！");
                return;
            }
            var hashCode = md5js($("#newPassword2").val());
            $.post("/vpi/user/changePassword", {oldPassword:$("#oldPassword").val(), newPassword:hashCode}, function(result){
                if(result.success){
                    humaneNotify.error = humaneNotify.spawn({ addnCls: 'humane-libnotify-error', timeout: 2000 });
                    humaneNotify.error('更改成功,下次登录生效!');
                    $("#changePwdModal").modal("hide");
                    Backbone.history.loadUrl();
                }else{
                    humaneNotify.info = humaneNotify.spawn({ addnCls: 'humane-libnotify-error', timeout: 8000 });
                    if(result.message){
                        humaneNotify.info(result.message);
                    }else{
                        humaneNotify.info("更改失败");
                    }

                }
            });
        }
    });


    var LoginModalView = Backbone.View.extend({

        initialize: function(){

        },
        render : function(){
            this.$el.html(tpl.get("myvpi/login-modal"));
            return this.el;
        },
        events: {
            "click #userRegisterBtnLink" : "registerUser",
            "click #userLoginBtn" : "postLogin"
        },

        registerUser : function(){
          //  alert(":asfd")
            $("#loginModal").modal("hide");
            if(this.registerModalView){
                this.registerModalView.close();
            }
            this.registerModalView = new RegisterModalView();
            $("body").append(this.registerModalView.render());

            $("#registerModal").modal({backdrop:"static", show:true});
        },
        postLogin : function(event){
            event.preventDefault();
            var self = this;
            var hashCode = md5js($("#passwordTxt").val());
            $.post("/vpi/userLogin", {username:$("#userNameTxt").val(), password:hashCode}, function(result){

                if(result.success){
                    $("#loginModal").modal("hide");
                    setTimeout(function(){
                         new MyVpiHeaderView().render();
                        self.close();
                    },1000);
                    humaneNotify.log("登录成功!");
                }else{
                    humaneNotify.log(result.error);
                }
            });
        }


    });

    var RegisterModalView = Backbone.View.extend({
        render : function(){
            this.$el.html(tpl.get("myvpi/register-modal"));
            return this.el;
        },
        events : {
            "click #userLoginBtnLinkInRegister" : "userLogin",
            "click #userRegister" : "userRegister"
        },
        userLogin : function(){
            $("#registerModal").modal("hide");
            if(this.registerModalView){
                this.registerModalView.close();
            }

            if(this.loginModalView){
                this.loginModalView.close();
            }
            this.loginModalView = new LoginModalView();
            $("body").append(this.loginModalView.render());
            $("#loginModal").modal({backdrop:"static", show:true});
        },
        userRegister : function(event){
            event.preventDefault();
            if($("#passwordReg2").val()!=$("#passwordReg1").val()){
                humaneNotify.log("新密码不一致！");
                return;
            }
            var hashCode = md5js($("#passwordReg1").val());
            $.post("/vpi/userRegister", {username:$("#usernameTxt").val(), fullName:$("#fullNameTxt").val(),password:hashCode, phonenumber:$("#phonenumberTxt").val()},
                function(result){
                if(result.success){
                //    $.post('/vpi/class/addStudents',{
                //            student:result.account_id,
                //            class:"111111111111111111111111"
                //        },
                //        function(result){
                //            if (result.success){
                //                humaneNotify.log("注册成功!");
                //                $("#registerModal").modal("hide");
                //                console.log(window.app);
                //                window.location.reload();
                //            }else{
                //                alert("出错");
                //            }
                //        });
                     humaneNotify.log("注册成功!");
                     $("#registerModal").modal("hide");
                     console.log(window.app);
                     window.location.reload();
                }else{
                    for(var i in result.error){

                        humaneNotify.log(result.error[i].message);
                     return ;
                    }
                }
            });
        }
    });


    return MyVpiHeaderView;

});
