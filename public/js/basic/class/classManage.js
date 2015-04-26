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
    $("#classGrid").datagrid({
        url:'/vpi/class/all', 
        method:'POST',
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"教室管理",
        rownumbers:true,
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
                  //{field:'ck', checkbox:true},
                  {field:'_id', title:'编号' , fit:true ,hidden:true},
                  {field:'name', title:'名称', fit:true,width:80 },
                  {field:'classType', title:'班级分类', width:80 ,fit:true,
                        formatter: function(value,row,index){
                                if(row.classType){
                                   return row.classType.name;
                                }else{
                                    return "免费";
                                }
                        }
                  },
                  {field:'startDate', title:'开班时间' ,width:150 , fit:true,
                        formatter:function(value,row,index){
                            return row.startDate.substring(0,10);
                        }
                  },
                  {field:'endDate', title:'结束时间',width:150 , fit:true,
                      formatter:function(value,row,index){
                          return row.endDate.substring(0,10);
                      }},
                  {field:'place', title:'上课地点' ,width:150 , fit:true},
                  {field:'classTime', title:'上课时间',width:200 , fit:true},
            {field:'fee', title:'学费',width:100  , fit:true},
        ]],
        onLoadError: function(msge){
            $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
        },
        onLoadSuccess: function(){
            $.post('/vpi/classType/all',{},
                    function(result){
                    if (result.success){
                        result.rows.push({ "name": "免费","_id":"0"});
                        $('#classType').combobox("loadData",result.rows);
                       result.rows.push({ "name": "全部","_id":""});
                        $('#cc1').combobox("loadData",result.rows);
                    } else {
                        $.messager.show({    // show error message
                            title: '错误',
                            msg: '错误'
                        });
                    }
                })
        }
    });
});




//OrganizationCrud dialog
var url;
var selectedRow;

//Initial the parentId
function newForm(){

    
    $('#dlg').dialog('open').dialog('setTitle','新建班级');
    $('#fm').form('clear');
    url = '/vpi/class/add';
}

function findByClassType(){
    var cc1Value = $('#cc1').combobox('getValue');
    $('#classGrid').datagrid('load', {classType:cc1Value});
}

function editForm(){
    
    selectedRow = $('#classGrid').datagrid('getSelected');
    
    if (selectedRow){
        $('#dlg').dialog('open').dialog('setTitle','修改班级');
        $('#fm').form('load',selectedRow);

        if(selectedRow.classType){
            $('#classType').combobox("select",selectedRow.classType._id);
        }else{
            $('#classType').combobox("select","0");
        }
        console.info(selectedRow);
        url = '/vpi/class/update';
    }
}
function c (){

}
function saveForm(){
    var startDate = $("#startDate").datebox("getValue");
    var endDate = $("#endDate").datebox("getValue");
    var start = new Date(startDate.replace("-", "/").replace("-", "/"));
    var end = new Date(endDate.replace("-", "/").replace("-", "/"));
    var classType = $('#classType').combobox('getValue');
    var fee = $('#fee').val();
        if(classType!="0"){
            if(fee == "0"){
                alert("价格为0时只能是免费分类");
                return;
            }
        }else{
            if(fee!= "0"){
                alert("免费分类价格必须为0");
                return;
            }
        }

    if (end < start) {
        alert("结束时间不能早于开始时间");
    }else{

         $('#fm').form('submit',{
                url: url,
                onSubmit: function(param){
                    if(url=='/vpi/class/update'){
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
                      $('#classGrid').datagrid('reload');
                    }
                }
            });
    }
}
function destroySelectedItems(){
    var rows = $('#classGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){

                $.post('/vpi/class/delete',{_id:rows[0]._id},function(result){
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
                        $('#classGrid').datagrid('reload');
                        
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


