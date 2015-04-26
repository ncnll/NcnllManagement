/***
 * author: charmyin
 * datetime: 2014-10-16
 * title: Control the classtype ~
 ***/

/********************************************************Initial the page*****************************************************/
$(function(){
	//Disable cache
	jQuery.ajaxSetup({ cache: false });
                 $.post('/vpi/classType/all',{
                    },
                    function(result){
                    if (result.success){
                        result.rows.push({ "name": "免费","_id":"0"});
                       $('#classType').combobox("loadData",result.rows);
                        result.rows.push({ "name": "全部","_id":""});
                        $('#sclassType').combobox("loadData",result.rows);
                       
                    } else {
                        $.messager.show({    // show error message
                            title: '错误',
                            msg: '错误'
                        });
                    }
         });
	//Load grid
    $("#lessonGrid").datagrid({
        url:'/vpi/lesson/all', 
        method:'POST',
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"教程管理",
        rownumbers:true,
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
             //{field:'ck', checkbox:true},
             {field:'_id', title:'编号' , width:300,hidden:true},
             {field:'title', title:'标题', width:200},
             {field:'content', title:'教程内容', width:420,hidden:true},
             // {field:'image', title:'图片', width:200},
             {field:'classType', title:'班级分类', width:200,
                 formatter: function(value,row,index){
                     if(row.classType){
                         return row.classType.name;
                     }else{
                         return "免费";
                     }
                }
             },
            {field:'price', title:'教程价格', width:100},
            {field:'detailed', title:'详细', width:200 ,formatter:function(value,row,index){
                return "<a href='javascript:void(0)' onclick='detailed(\""+row._id+"\")')''>[详情]</a>"
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
//查看详细
function detailed(id){
    readonlyTrue();
    selectedRow = $('#lessonGrid').datagrid('getSelected');

    if(!id){
        id = selectedRow._id;
    }
    $.post("/vpi/lesson/lessonById",{
        _id:id
    },function(result){
        if(result.success){
            $('#dlg').dialog('open').dialog('setTitle','查看详细');
            $("#dlg-buttons").hide();
                $("#uplodeimage").hide();
                $('#fm').form('load',result.rows);
            var uri = "/images/"+result.rows.image;
            $("#lessonimage").attr("src",uri);
            if(result.rows.classType){
                   $('#classType').combobox("select",result.rows.classType);
             }else{
                   $('#classType').combobox("select","0");
             }
        }
    });

}
//将文本框设为只读
function readonlyTrue(){
    //将所有的框设置为只读
    $('#titletxt').attr("readonly",true);
    $('#content').attr("readonly",true);
    $('#price').attr("readonly",true);
}
//将文本框设为只读
function readonlyfalse(){
    //将所有的框设置为只读
    $('#titletxt').attr("readonly",false);
    $('#content').attr("readonly",false);
    $('#price').attr("readonly",false);
}



//添加教程
function newForm(){
    readonlyfalse();
    $('#dlg').dialog('open').dialog('setTitle','添加教程');
    $("#dlg-buttons").show();
    $("#uplodeimage").show();
    $('#lessonimage').attr('src',"");
    $('#uplodeimage').form('clear');
    $('#fm').form('clear');
    url = '/vpi/lesson/add';
}
//修改教程
function editForm(){
    readonlyfalse();
   selectedRow = $('#lessonGrid').datagrid('getSelected');
    $("#dlg-buttons").show();
    $("#uplodeimage").show();
    if (selectedRow){
        $('#dlg').dialog('open').dialog('setTitle','修改教程');
        $('#fm').form('load',selectedRow);
       //根据Id获取教程内容
        $.ajax({
            type: "POST",
            url: "/vpi/lesson/lessonById",
            data: { _id:selectedRow._id}
        }) .done(function( msg ) {
            $("#content").attr("value",msg.rows.content);
        });
        var uri = "/images/"+selectedRow.image;
        $("#lessonimage").attr("src",uri);
        //url = '/vpi/pictureType/update';
        if(selectedRow.classType){
         $('#classType').combobox("select",selectedRow.classType._id);
        }else{
            $('#classType').combobox("select","0");
        }

        url = '/vpi/lesson/update';
    }else{
        alert("请先选中一行");
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
              $("#lessonimage").attr("src",url);
              var uri = result.files[0].url.substr(16);
              $("#uri").attr("value",uri);
            }
        }
    });

}
//根据条件查询
function select(){
    //获取用户输入标题
    var title = $('#title').val();
    //获取用户选择分类
    var classType=$("#sclassType").combobox("getValue");
    $("#lessonGrid").datagrid("load", {
        title : title,
        classType :classType
    });
}
//修改教程
function saveForm(){
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(param){

            if(url=='/vpi/lesson/update'){
                param._id = selectedRow._id;
            }
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

                $.messager.show({
                	title: '提示',
                    msg: "<div style='text-align:center;margin-top:10px;'>成功!</div>",
                    style:{
                		right:'',
                		top:document.body.scrollTop+document.documentElement.scrollTop,
                		bottom:''
                	}
                });
              $('#lessonGrid').datagrid('reload');
            }
        }
    });
}
//删除教程  逻辑删除
function destroySelectedItems(){
    var rows = $('#lessonGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){

            	$.post('/vpi/lesson/delete',{_id:rows[0]._id},function(result){
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
                        $('#lessonGrid').datagrid('reload');

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


