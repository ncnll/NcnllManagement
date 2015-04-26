/***
 * author: charmyin
 * datetime: 2014-10-16
 * title: Control the classtype ~
 ***/

/********************************************************Initial the page*****************************************************/
$(function(){
	//Disable cache
	jQuery.ajaxSetup({ cache: false });

	//Load grid
    $("#classTypeGrid").datagrid({
        url:'/vpi/classType/all', 
        method:'POST',
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"教室类别管理",
        rownumbers:true,
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
                  //{field:'ck', checkbox:true},
                  {field:'_id', title:'编号' , width:340,hidden:true},
                  {field:'name', title:'名称', width:340},
                  {field:'description', title:'备注', width:340}
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
    $('#dlg').dialog('open').dialog('setTitle','新建班级类型');
    $('#fm').form('clear');
    url = '/vpi/classType/add';
}
function editForm(){
    selectedRow = $('#classTypeGrid').datagrid('getSelected');
 
    if (selectedRow){
        $('#dlg').dialog('open').dialog('setTitle','修改班级类型');
        $('#fm').form('load',selectedRow);
        url = '/vpi/classType/update';
    }
}
function saveForm(){
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(param){
            if(url=='/vpi/classType/update'){
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
                    msg: "<div style='text-align:center;margin-top:10px;'>保存成功!</div>",
                    style:{
                		right:'',
                		top:document.body.scrollTop+document.documentElement.scrollTop,
                		bottom:''
                	}
                });
              $('#classTypeGrid').datagrid('reload');
            }
        }
    });
}
function destroySelectedItems(){
    var rows = $('#classTypeGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){

            	$.post('/vpi/classType/delete',{_id:rows[0]._id},function(result){
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
                        $('#classTypeGrid').datagrid('reload');
                    	
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


