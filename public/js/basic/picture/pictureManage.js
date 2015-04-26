/***
 * author: charmyin
 * datetime: 2014-10-16
 * title: Control the classtype ~
 ***/

/********************************************************Initial the page*****************************************************/
$(function(){
	//Disable cache
	jQuery.ajaxSetup({ cache: false });
    //图片分类
    $.post('/vpi/pictureType/all',{
        },
        function(result){
            if (result.success){
                $('#pictureType').combobox("loadData",result.rows);
                result.rows.push({ "name": "全部","_id":""});
                $('#selectType').combobox("loadData",result.rows);
            } else {
                $.messager.show({    // show error message
                    title: '错误',
                    msg: '错误'
                });
            }
        });
	//Load grid
    $("#pictureGrid").datagrid({
        url:'/vpi/pictures/all', 
        method:'POST',
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"图片管理",
        rownumbers:true,
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
             //{field:'ck', checkbox:true},
             {field:'_id', title:'编号' , width:150,hidden:true},
             {field:'name', title:'图片名称', width:180},
             //{field:'uri', title:'图片路径', width:200},
             {field:'description', title:'图片描述', width:180},
             {field:'lesson', title:'图片教程', width:180,
             formatter: function(value,row,index){
                            if(row.lesson != null){
                                return row.lesson.title;
                            }else{
                                return "";
                            }
                        }},
             {field:'user',title:'所属用户', width:180,
             formatter: function(value,row,index){
                            if(row.user != null)
                                return row.user.username;
                        }},
             //{field:'type', title:'图片分类', width:100,
             //formatter: function(value,row,index){
             //               if(row.type != null)
             //                   return row.type.name;
             //           }},
             {field:"status", title:'图片状态',width:180,
             formatter: function(value,row,index){
                            if(row.status == 0){
                                return "未审核  <a href='javascript:void(0)'onclick='detailed(\""+row._id+"\")')''>[审核]</a>";
                            }else if (row.status == 1){
                                return "可展示  <a href='javascript:void(0)'onclick='detailed(\""+row._id+"\")')''>[详情]</a>";
                            }else if(row.status ==2){
                                return "不展示  <a href='javascript:void(0)'onclick='detailed(\""+row._id+"\")')''>[详情]</a>";
                            }
                        }}

        ]],

        onLoadError: function(msge){
            $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
        }
    });
});

//详细信息和修改
function detailed(id){
    var rows = $('#pictureGrid').datagrid('getSelections');
    $('#fm').form('clear');
    if(!id){
       id=rows[0]._id;
    }
    $.post("/vpi/pictures/all",{
    _id:id
    },function(result){
        if (result.success){
            $('#detailed').dialog('open').dialog('setTitle','图片');
            $("#homeworkimg").attr("src","/images/"+result.rows[0].uri);
            $("#download").attr("href","/vpi/pictures/downloadfile/"+result.rows[0].uri);
            //http://localhost:18081/vpi/pictures/downloadfile/54865f09c7375f3013f7a4ee.jpg
            //上传_id
            $("#_id").attr("value",result.rows[0]._id);
            $("#description").attr("value",result.rows[0].description);
            //图片名称
            $("#name").html(result.rows[0].name);
            //上传人
            $('#user').html(result.rows[0].user.username);
            //上传时间
            $('#createDate').html(result.rows[0].createDate);

            if(result.rows[0].status=="1"){
                document.getElementsByName("status")[0].checked="checked";
            }else if (result.rows[0].status =="2"){
                document.getElementsByName("status")[1].checked="checked";
            }else{
                document.getElementsByName("status")[0].checked="";
                document.getElementsByName("status")[1].checked="";
            }
        }
    });
}
//OrganizationCrud dialog
var url;
var selectedRow;
//Initial the parentId
//根据条件查询
function select (){
    var status=$("#pictureStatus").combobox("getValue");
    //var selectType = $('#selectType').combobox("getValue");
        $("#pictureGrid").datagrid("load", {
            status : status
            //type:selectType
        });
}
function newForm(){
    $('#detailed').dialog('open').dialog('setTitle','添加分类');
    $('#fm').form('clear');
    url = '/vpi/pictures/add';
}
function saveForm(){
    $('#fm').form('submit',{
        url:'/vpi/pictures/update',
        onSubmit: function(param){
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
                $('#detailed').dialog('close');        // close the dialog
                
                $.messager.show({
                	title: '提示',
                    msg: "<div style='text-align:center;margin-top:10px;'>成功!</div>",
                    style:{
                		right:'',
                		top:document.body.scrollTop+document.documentElement.scrollTop,
                		bottom:''
                	}
                });
              $('#pictureGrid').datagrid('reload');
            }
        }
    });
}
function destroySelectedItems(){
    var rows = $('#pictureGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){
            	$.post('/vpi/pictures/delete',{_id:rows[0]._id},function(result){
                    if (result.success){
                    	$.messager.show({
                        	title: '提示',
                            msg: "<div style='text-align:center;margin-top:10px;'>删除成功!</div>",
                            style:{
                        		right:'',
                        		top:document.body.scrollTop+document.documentElement.scrollTop,
                        		bottom:''
                        	}
                        });
                        $('#pictureGrid').datagrid('reload');
                    	
                    } else {
                        $.messager.show({    // show error message
                            title: '提示<span style="color:red;">!</span>',
                            msg: "<div style='text-align:center;margin-top:10px;'>"+result.errorMsg+"</div>",
                            style:{
                        		right:'',
                        		top:document.body.scrollTop+document.documentElement.scrollTop,
                        		bottom:''
                        	}
                        });
                        
                    }
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

//上传图片
function uplodeimage(){
    $('#uplodeimage').form('submit',{
        url: '/vpi/picupload',
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
                var url =  result.files[0].url.substr(8);
                $("#homeworkimg").attr("src",url);
                var uri = result.files[0].url.substr(16);
                $("#uri").attr("value",uri);
                $("#download").attr("href",uri);
            }
        }
    });

}
