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
    $("#pictureTypeGrid").datagrid({
        url:'/vpi/pictureType/all', 
        method:'POST', 
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"图片分类管理",
        rownumbers:true,
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],  toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"图片分类管理",
        rownumbers:true,
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
             //{field:'ck', checkbox:true},
             {field:'_id', title:'编号' , width:200,hidden:true},
             {field:'name', title:'分类名称', width:200},
             {field:'introduction', title:'分类描述', width:200}
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
    $('#dlg').dialog('open').dialog('setTitle','添加分类');
    //$("#image").arrt("src","");
    //$("#uri").arrt("value","");
    $('#fm').form('clear');
    $("#typeimage").attr("src","");
    $('#uplodeimage').form('clear');
    url = '/vpi/pictureType/add';
}
function editForm(){
    selectedRow = $('#pictureTypeGrid').datagrid('getSelected');
    if (selectedRow){
        $('#dlg').dialog('open').dialog('setTitle','修改分类');
        $('#fm').form('load',selectedRow);
        var uri = "/images/"+selectedRow.uri;
        $("#typeimage").attr("src",uri);
        url = '/vpi/pictureType/update';
    }
}
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
              $("#typeimage").attr("src",url);
              var uri = result.files[0].url.substr(16);
              $("#uri").attr("value",uri);
            }
        }
    });

}

function saveForm(){
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(param){
            if(url=='/vpi/pictureType/update'){
                console.log(selectedRow+"+++++++++++++++");
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
              $('#pictureTypeGrid').datagrid('reload');
                $('#fm').form('clear');
                $('#uplodeimage').form('clear');
            }
        }
    });
}
function destroySelectedItems(){
    var rows = $('#pictureTypeGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){

            	$.post('/vpi/pictureType/delete',{_id:rows[0]._id},function(result){
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
                        $('#pictureTypeGrid').datagrid('reload');
                    	
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


