/***
 * author: charmyin
 * datetime: 2014-10-16
 * title: Control the classtype ~
 ***/

 var changeDisabledState = function(id, state){
    $.post("/vpi/user/update", {_id:id, isDisabled:state}, function(result){
        if(result.success){
            $.messager.show({
                title: '提示<span style="color:red;">!</span>',
                msg: "<div style='text-align:center;margin-top:10px;'>更改成功！</div>",
                style:{
                    right:'',
                    top:document.body.scrollTop+document.documentElement.scrollTop,
                    bottom:''
                }
            });
        }else{
            $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
        }

        $("#teacherGrid").datagrid("reload");
    });
 }



 var resetPassword = function(id){
    $.messager.confirm('提示信息','确定重置密码？',function(r){
        if(r){
            $.post("/vpi/user/resetPassword", {_id:id}, function(result){
                if(result.success){
                    $.messager.show({
                        title: '提示<span style="color:red;">!</span>',
                        msg: "<div style='text-align:center;margin-top:10px;'>更改成功！</div>",
                        style:{
                            right:'',
                            top:document.body.scrollTop+document.documentElement.scrollTop,
                            bottom:''
                        }
                    });
                }else{
                    $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
                }

            });
        }
    });
    
 }

/********************************************************Initial the page*****************************************************/
$(function(){
	//Disable cache
	jQuery.ajaxSetup({ cache: false });
	//Load grid
    $("#stuGrid").datagrid({
        url:'/vpi/getUsers', 
        method:'POST',
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"学员管理",
        rownumbers:true,
        queryParams:{userrole:0},
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
                  //{field:'ck', checkbox:true},
                  {field:'_id', title:'编号' , width:120,hidden:true},
                  {field:'username', title:'登录名', width:150},
                  {field:'fullName', title:'真实姓名', width:150},
                  {field:'email', title:'邮箱', width:180},
                  {field:'createDate', title:'创建日期', width:180},
            {field:'operate', title:'操作', width:130, formatter: function(value,row,index){
                            if(row.isDisabled){
                                return "<span style='color:red;'>已禁用</span>[<a href='#' onclick='changeDisabledState(\""+row._id+"\", false)'>启用<a/>]";
                            }else{
                                return "<span style='color:green;'>已启用</span>[<a href='#' onclick='changeDisabledState(\""+row._id+"\", true)'>禁用<a/>]";
                            }   
                  }},
                  {field:'resetPassword', title:'重置密码', width:130, formatter: function(value,row,index){
                        return "[<a href='#' onclick='resetPassword(\""+row._id+"\")'>重置<a/>]";                      
                  }}
        ]],
        onLoadError: function(msge){
            $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
        }
    });
});

//OrganizationCrud dialog
var url;
var selectedRow;

//Initial the parentId
function newForm(){
    $('#dlg').dialog('open').dialog('setTitle','学员注册');
    $('#fm').form('clear');
    //$('#usernameId').removeAttr('disabled');
    url = '/backend/teacher/save';
}
/*根据条件查询*/
function select (){

    var disable=$("#disbale").combobox("getValue");
    var username=$("#username").val();

        $("#stuGrid").datagrid("load", {
            userrole:0,
            isDisabled : disable,
            username:username
        });

}

function editForm(){
    selectedRow = $('#stuGrid').datagrid('getSelected');

    //$('#usernameId').textbox('readonly',true);
   
    //$("#usernameId").textbox("readonly");
    if (selectedRow){
        $('#dlg').dialog('open').dialog('setTitle','学员修改');
        $('#fm').form('load',selectedRow);
        //$('#usernameId').attr('disabled', 'disabled');
        url = '/vpi/user/update';
    }
}
function update()
{alert(url);
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(param){
            if(url=='/vpi/user/update'){
                param._id = selectedRow._id;
            }
            //组件验证，未通过则返回false
            return $(this).form('validate');
        },
        success: function(resultString){
            alert("");
            var result = eval("("+resultString+")");
            if (!result.success){
                $.messager.show({
                    title: '提示<span style="color:red;">!</span>',
                    msg: "<div style='text-align:center;margin-top:10px;'>"+result.msg+"</div>",
                    style:{
                        right:'',
                        top:document.body.scrollTop+document.documentElement.scrollTop,
                        bottom:''
                    }
                });
            } else {
                $.messager.show({
                    title: '提示',
                    msg: "<div style='text-align:center;margin-top:10px;'>成功!</div>",
                      style:{
                             right:'',
                            top:document.body.scrollTop+document.documentElement.scrollTop,
                           bottom:''
                     }
               });

                //$.messager.show({
                //	title: '提示',
                //    msg: "<div style='text-align:center;margin-top:10px;'>保存成功!</div>",
                //    style:{
                //		right:'',
                //		top:document.body.scrollTop+document.documentElement.scrollTop,
                //		bottom:''
                //	}
                //});
                $('#stuGrid').datagrid('reload');
            }
        }
    });
}
function  form (){
//alert("ss");
    if(url=='/vpi/user/update'){
        //alert("ss");
       update();
    }else{
        saveForm();
    }
}
function saveForm(){
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(param){
            param.userrole = 0;
            param.password = "C5FE25896E49DDFE996DB7508CF00534";

        	//组件验证，未通过则返回false
        	return $(this).form('validate');
        },
        success: function(resultString){
        	var result = eval("("+resultString+")");
            if (!result.success){
                $.messager.show({
                	title: '提示<span style="color:red;">!</span>',
                    msg: "<div style='text-align:center;margin-top:10px;'>"+result.msg+"</div>",
                    style:{
                		right:'',
                		top:document.body.scrollTop+document.documentElement.scrollTop,
                		bottom:''
                	}
                });
            } else {
                $('#dlg').dialog('close');        // close the dialog
                $.post('/vpi/class/addStudents',{
                        student:result.account_id,
                        class:"111111111111111111111111"
                    },
                    function(result){
                        if (result.success){
                            $.messager.show({
                                title: '提示',
                                msg: "<div style='text-align:center;margin-top:10px;'>成功!</div>",
                                style:{
                                    right:'',
                                    top:document.body.scrollTop+document.documentElement.scrollTop,
                                    bottom:''
                                }
                            });
                        }else{
                            alert("出错");
                        }
                    });
                //$.messager.show({
                //	title: '提示',
                //    msg: "<div style='text-align:center;margin-top:10px;'>保存成功!</div>",
                //    style:{
                //		right:'',
                //		top:document.body.scrollTop+document.documentElement.scrollTop,
                //		bottom:''
                //	}
                //});
              $('#stuGrid').datagrid('reload');
            }
        }
    });
}
function destroySelectedItems(){
    var rows = $('#stuGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){

            	$.post("/vpi/user/update", {_id:rows[0]._id, isDeleted:true}, function(result){
                    if(result.success){
                        $.messager.show({
                            title: '提示<span style="color:red;">!</span>',
                            msg: "<div style='text-align:center;margin-top:10px;'>更改成功！</div>",
                            style:{
                                right:'',
                                top:document.body.scrollTop+document.documentElement.scrollTop,
                                bottom:''
                            }
                        });
                    }else{
                        $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
                    }

                    $("#stuGrid").datagrid("reload");
                });
            }
        });
    }else{
    	$.messager.show({    // show error message
            title: '提示<span style="color:red;">!</span>',
            msg: "<div style='text-align:center;margin-top:10px;'>请选择要删除的行！</div>",
            style:{
        		right:'',
        		top:document.body.scrollTop+document.documentElement.scrollTop,
        		bottom:''
        	}
        });
    }
}


