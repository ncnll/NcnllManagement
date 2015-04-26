var itemName="学生";
var selectedNodeId;
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

//更改
function update(){
    $('#update').form('submit',{
        url:'/vpi/student/update',
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
                $('#status').dialog('close');        // close the dialog

                $.messager.show({
                    title: '提示',
                    msg: "<div style='text-align:center;margin-top:10px;'>审核成功!</div>",
                    style:{
                        right:'',
                        top:document.body.scrollTop+document.documentElement.scrollTop,
                        bottom:''
                    }
                });
                $('#stuStatusGrid').datagrid('reload');
            }
        }
    });
}
//var setting = {
//        data: {
//            simpleData: {
//                enable: true,
//                idKey: "_id",
//                pIdKey: "classType"
//                        // rootPId: 0
//            }
//        },
//        callback : {
//            onClick:function (event,treeId,node) {
//            selectedNodeId = node._id;
//            console.log(selectedNodeId+"#########");
//
//        }
//    }
//};


var url;
var selectedRow;

$(function(){
    jQuery.ajaxSetup({ cache: false });
    $("#stuStatusGrid").datagrid({
        url:'/vpi/student/all',
        method:'POST',
        toolbar:'#toolbar',
        pagination:true,
        collapsible:true,
        title:"学员管理",
        rownumbers:true,
        queryParams:{status:0},
        singleSelect:true,
        pageSize:10,
        pageList:[10,20,50,100],
        columns:[[
            //{field:'ck', checkbox:true},
            {field:'_id', title:'编号' , width:120,hidden:true},

            {
                field:'student',
                title:'登录名', width:100,
                fit:true,
                formatter:function(value,row,index){
                    if(row.student)
                        return row.student.username;
                }
            }, {
                field:'students',
                title:'真实姓名', width:100,
                fit:true,
                formatter:function(value,row,index){
                    if(row.student)
                        return row.student.fullName;
                }

            },
            {field:'classs', title:'班级' , width:100 , fit:true,
                formatter: function(value,row,index){
                    if(row.class)
                        return row.class.name;
                }
            },
            {
                field: 'classType', title: '班级类别', width: 130, fit: true,
                formatter: function (value, row, index) {
                    if (row.classType)
                        return row.classType.name;
                }
            },
            //},
            //{field:'isDisable', title:'是否禁用' , width:130, fit:true,
            //    formatter: function(value,row,index){
            //        if(row.isDisable){
            //            return "<span style='color:red;'>已禁用</span>[<a href='#' onclick='disableStudent(\""+row._id+"\", false)'>启用<a/>]";
            //        }else{
            //            return "<span style='color:green;'>已启用</span>[<a href='#' onclick='disableStudent(\""+row._id+"\", true)'>禁用<a/>]";
            //        }
            //    }
            //},
            //{field:'resetPassword', title:'重置密码' , width:130, fit:true,
            //    formatter: function(value,row,index){
            //        return "[<a href='#' onclick='resetPassword(\""+row.student._id+"\")'>重置<a/>]";
            //    }
            //},
            {field:"status", title:"学员状态" , width:140,fit:true,
                formatter: function(value,row,index){
                    if(row.status == 0){
                        return "<a href='javascript:void(0)'onclick='status(\""+row._id+"\",\""+row.status+"\")'>[未审核]</a>";
                    }else if (row.status == 1){
                        return "<a href='javascript:void(0)'onclick='status(\""+row._id+"\",\""+row.status+"\")'>[已付费]</a>";
                    }else if(row.status ==2){
                        return "<a href='javascript:void(0)'onclick='status(\""+row._id+"\",\""+row.status+"\")'>[未付费]</a>";
                    }
                }}
        ]],
        onLoadError: function(msge){
            $.messager.alert('错误信息','服务器连接已断开或服务器内部错误！','error');
        }
    });

});

//根据用户名获取用户ID
function findByName (){
    var stuName = $('#stuName').val();
    if(stuName){
        $.post('/vpi/user/findByName',{stuName:stuName},function(result){
            if(result.success){
                $("#userId").attr("value",result.stu._id);
            }
        });
    }

}
//更改学员状态
function status (id,status){

        $('#status').dialog('open').dialog('setTitle','学员状态');
        $("#_id").attr("value",id);
        var status = status;
        if(status==1){
            document.getElementsByName("status")[0].checked="checked";
        }else if (status ==2){
            document.getElementsByName("status")[1].checked="checked";
        }else{
            document.getElementsByName("status")[0].checked="";
            document.getElementsByName("status")[1].checked="";
        }

}
function pagerFilter(data){
    if (typeof data.length == 'number' && typeof data.splice == 'function'){
        data = {
            total: data.length,
            rows: data
        }
    }
    console.log(data.total+"aa"+data.rows);
    var dg = $(this);

    var opts = dg.datagrid('options');
    var pager = dg.datagrid('getPager');
    pager.pagination({
        onBeforeRefresh:function(){
            dg.datagrid("reload");
        },
        onSelectPage:function(pageNum, pageSize){
            opts.pageNumber = pageNum;
            opts.pageSize = pageSize;
            pager.pagination('refresh',{
                pageNumber:pageNum,
                pageSize:pageSize
            });
            dg.datagrid('loadData',data);
        }
    });
    console.log(data.originalRows+"bb");
    if (!data.originalRows){
        data.originalRows = (data.rows);
    }
    console.log(data.originalRows+"cc");
    var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
    console.log(start+"start");
    var end = start + parseInt(opts.pageSize);
    console.log(end+"end");
    data.rows = (data.originalRows.slice(start, end));
    console.log(data.rows.length+"data.rows");
    return data;
}
//修改
function editForm(){
    selectedRow = $('#stuStatusGrid').datagrid('getSelected');

if(selectedRow){
    $('#dlg').dialog('open').dialog('setTitle','修改班级分类');
    $('#fm').form('load',selectedRow);

    if(selectedRow.classType){
        $('#classType').combobox("select",selectedRow.classType._id);
    }else{
        $('#classType').combobox("select","0");
    }
        if(selectedRow.class){
            $('#class').combobox("select",selectedRow.class.name);
        }else{
            $('#class').combobox("select","0");
        }
    //班级分类的下拉列表
    $.post('/vpi/classType/all',{
        },
        function(result){
            if (result.success){
                //result.rows.push({ "name": "免费","_id":"0"});
                // alert(result.rows[10].name);
                $('#classType').combobox("loadData",result.rows);
            }
        }
    );
    var ct = selectedRow.classType._id;
    if(!ct){
        ct = "0";
    }
    var endDate = new Date();
    //alert(endDate);

    //班级下拉列表
    $.post('/vpi/class/all',{
            classType:ct,
            endDate :endDate
        },
        function(result){
            if (result.success){
                $('#class').combobox("loadData",result.rows);
            }
        }
    );

    url = '/vpi/student/updateClass';
}else{
    alert("请先选中一行");
}
}


function saveForm(){
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(param){
            if(url=='/vpi/student/updateClass'){
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
                $('#organizationGrid').datagrid('reload');
            }
        }
    });
}

//重置密码
function  resetPassword(){
    var rows = $('#stuStatusGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息',"是否重置密码",function(r){
            if(r){
                $.post('/vpi/user/resetPassword',{_id:rows[0]._id},function(result){
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
                        $('#stuStatusGrid').datagrid('reload');
                    }else{
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
            msg: "<div style='text-align:center;margin-top:10px;'>请选中行！</div>",
            style:{
                right:'',
                top:document.body.scrollTop+document.documentElement.scrollTop,
                bottom:''
            }
        });
    }
}

//是否禁用
function disableStudent(id,disbale){
    $.post("/vpi/class/disableStudent", {student:id, disbale:disbale}, function(result){
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

        $('#stuStatusGrid').datagrid('reload');
    });
}

function destroySelectedItems(){
    var rows = $('#stuStatusGrid').datagrid('getSelections');
    var rowsLength = rows.length;
    if (rowsLength>0){
        $.messager.confirm('提示信息','确定删除该行？',function(r){
            if (r){
                $.post('/vpi/class/deleteStudent',{student:rows[0]._id},function(result){
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
                        $('#stuStatusGrid').datagrid('load');
                        loadOrganizationTree();

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
