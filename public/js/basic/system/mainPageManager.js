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
    $.ajax({
         type: "POST",
         url: "/vpi/mainpage/content"
    })
  .done(function( msg ) {
    $("#_id").attr("value",msg.list._id);
    $("#pictures").attr("value",msg.list.pictures.toString());
    $("#introduction").attr("value",msg.list.introduction);
            detailed();
  });
});


//点击显示详细
function detailed(){
    var pictures =  $("#pictures").val();
    //var pic = eval("("+pictures+")");
    if(pictures!="") {
        var pic = pictures.split(",")
    }
    $('#imglist').innerHTML = "";
    for(var i = 0; i <pic.length; i++){
        var img = pic[i];
            $('#imglist').append("<img class='indexPagePicScroll' picId='"+pic[i]+"' src='/images/"+pic[i]+"' onclick='deleteimg(\""+pic[i]+"\", this)'  width='200' height = '150' /> ");
    }
}

//删除
function deleteimg (img,ev){
  ($.messager.confirm('提示信息','确定删除该行？',function(r){
      if(r){
          ev.remove();
      }
  }));
}


function saveForm(){
    var picArray=[];
    $(".indexPagePicScroll").each(function(){
        picArray.push($(this).attr("picId"));
    });
    var addpic = picArray.join("\",\"");

    $("#pictures").attr("value", "[\"" + addpic + "\"]");

   var _id =  $("#_id").val();
   var pictures =  $("#pictures").val();
   var introduction =  $("#introduction").val();
  $.ajax({
         type: "POST",
         url: "/vpi/mainpage/update",
         data: { _id:_id, pictures:pictures,introduction:introduction }
    })
  .done(function( msg ) {
     $.messager.show({
            title: '提示',
            msg: "<div style='text-align:center;margin-top:10px;'>更新成功!</div>",
            style:{
                 right:'',
                 top:document.body.scrollTop+document.documentElement.scrollTop,
                 bottom:''
            }
     });

  });

}

//上传图片
function uplodeimage(){
    var i =$(".indexPagePicScroll").length;
    if(i<4 ) {
        $('#uplodeimage').form('submit', {
            url: '/vpi/picupload',
            success: function (resultString) {
                var result = eval("(" + resultString + ")");
                if (!result.success) {
                    $.messager.show({
                        title: '提示<span style="color:red;">!</span>',
                        msg: "<div style='text-align:center;margin-top:10px;'>" + result.msg + "</div>",
                        style: {
                            right: '',
                            top: document.body.scrollTop + document.documentElement.scrollTop,
                            bottom: ''
                        }
                    });
                } else {
                    var url = result.files[0].url.substr(8);
                    //$("#image").attr("src", url);
                    var uri = result.files[0].url.substr(16);
                    $('#imglist').append("<img class='indexPagePicScroll' picId='"+uri+"' src='/images/"+uri+"' onclick='deleteimg(\""+uri+"\", this)'  width='200' height = '150' /> ");
                }
            }
        });
    }else{
        alert("最多显示4张图片");
    }
}
