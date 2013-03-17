/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 13-3-15
 * Time: 下午11:50
 * To change this template use File | Settings | File Templates.
 */

var xhr=null;

function formatSize(bytes){
    var i = -1;
    do {
        bytes = bytes / 1024;
        i++;
    } while (bytes > 99);

    return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
}

function getFilType(fileName){
    var splitArray=fileName.split('.');
    return splitArray[splitArray.length-1];
}

function dropEvent(evt){
    $(this).css({backgroundColor:'white'});
    var target=this;xhr=null;
    var fileList  = evt.originalEvent.dataTransfer.files,//获取拖拽文件
        fileName = fileList[0].name,
        fileSize = fileList[0].size;
    if(getFilType(fileName)!=='xls'&& getFilType(fileName)!=='xlsx'){
        alert("只能上传xls和xlsx文件！");
    }else{
        if (window.XMLHttpRequest && window.FormData){
            xhr=new XMLHttpRequest();
            var formData = new FormData();
            var url = "/upload?fileName=" + fileName+'&fileSize='+fileSize;
            formData.append("uploadFile", fileList[0]);
            xhr.open('POST', url, true);
            xhr.onloadstart = function(event){
                addMaskProgress(fileName,formatSize(fileSize),target.id);
            };
            xhr.ontimeout = function(event){alert('请求超时！\n 请联系管理员！');};
            xhr.error = function(event){alert('上传过程中发生错误！\n 请重新上传！');};
            xhr.onload = function (event) {
                if (xhr.status === 200) {console.log('上传成功!\n'+xhr.response);
                } else {console.log('上传过程中发生错误！\n 请重新上传！');}
            };
            xhr.upload.onprogress = function (evt){  //updateProgress 处理上传进度
                if (evt.lengthComputable) {
                    var percentComplete = parseInt((evt.loaded / evt.total)*100) ;
                    initMaskProgressWith(percentComplete/100,target);
                    console.log("Upload: " + percentComplete + "% complete");
                }
            };
            xhr.send(formData);  // multipart/form-data
        }else{
            alert("该浏览器不支持文件拖拽上传！");
        }
    }
    //相当于同时调用e.stopPropagation() 和 e.preventDefault()
    return false;//阻止事件冒泡和浏览器的默认行为
}

function initDropErea(targetID){
    var droperea = $("#"+targetID);
    droperea.bind('dragenter',function(evt){$(this).css({backgroundColor:'grey'});return false;})
        .bind('dragleave',function(evt){$(this).css({backgroundColor:'white'});return false;})
        .bind('dragover',function(evt){$(this).css({backgroundColor:'#a9a9a9'});return false;})
        .bind('drop',dropEvent)
        .bind('dragend',function(evt){$(this).css({backgroundColor:'grey'});return false;})
    var body=$(window);
    var bodyWidth=body.width(); var bodyHeight=body.height();
    droperea.css({
        position: 'absolute',
        width: bodyWidth*0.6,
        height: bodyHeight*0.6,
        top: bodyHeight*0.2,
        left: bodyWidth*0.2,
        'box-shadow':'5px 5px 24px #000',
        overflow: 'hidden',
        'behavior': 'url(/ie-css3.htc)'
    });
    var pArea='<div class="texterea">请将文件拖拽到这里上传</div>';
    droperea.append(pArea);
    $('.texterea').css({
        position: 'absolute',
        width: '300px',
        height : '60px',
        'line-height':'60px',
        'font-size' : 'x-large',
        'text-align' : 'center',
        top: (droperea.height()-60)/2+'px',
        left: (droperea.width()-300)/2+'px'
    });
}

function addMaskProgress(name,size,targetID){
    var mask='<div id="upload_mask" style="background: #000000 ;opacity: 0.7; width:800px;height:400px;position: absolute ">'+
        '</div>';
    var uploadProgressDiv='<div id="upload_progressDiv" style="height:200px;width: 400px ;left:200px;top:100px;position: absolute; background: #ffffff;opacity: 1; box-shadow:0 0 12px #ffffff">'+
        '<div id="upload_title" style=" height: 30px;font-size: large;width: 98%;left:2%; top:5%; position: absolute; line-height: 30px;">文件上传中…… </div>'+
        '<div style=" background-color: #000000 ;height: 1px;width: 100%;top:22%;position: absolute;"></div>'+
        '<div style=" height: 30px;font-size: large;width: 80%;left:12%;top: 28%; line-height: 30px; position: absolute">'+ name+' : '+size+'</div>'+
        '<div id="upload_progressBack" style="background-color: #808080 ;width: 60%;height:20px;left: 10%;top:50%;position: absolute;"></div>'+
        '<div id="upload_progress" style="background-color: greenyellow ;width: 0;height:20px;left: 10%;top:50%;position: absolute;"></div>'+
        '<div id="upload_progressText" style=" line-height: 20px;text-align: center;font-size: x-large; width: 30%;height:20px;left: 70%;top:50%;position: absolute;">0%</div>'+
        '<button id="upload_ensure" style="width: 20%;height: 30px;left: 20%;top: 74%;font-size: 15px;position: absolute;" onclick="startAnalysis(\''+name+'\',\''+targetID+'\')">开始分析</button>'+
        '<button id="upload_cancle" style="width: 20%;height: 30px;left: 60%;top: 74%;font-size: 15px;position: absolute;" onclick="cancelUpload(\''+name+'\',\''+targetID+'\')">取消</button>'+
        '</div>';
    var target=$(window);
    $('#app').append(mask).append(uploadProgressDiv);
    $('#upload_mask').css({width:target.width(),height:target.height(),position:'absolute',left:0,top:0});
    $('#upload_progressDiv').css({top:(target.height()-200)/2+'px' ,left:(target.width()-400)/2+'px'});
    $('#upload_ensure').attr("disabled",true);
}

function initMaskProgressWith(progress,droperea){
    var progressWidth=progress * $('#upload_progressBack').width();
    $('#upload_progress').css({width:progressWidth+'px'});
    $('#upload_progressText').text(parseInt(progress*100)+'%');
    if(progress==1){
        $('#upload_ensure').attr("disabled",false);
        $('#upload_title').text('文件已上传成功！');
    }
}

function startAnalysis(fileName,targetID){
    $('#upload_mask').remove();
    $('#upload_progressDiv').remove();
    $('#'+targetID).hide();
    $('.promptInfo').show().text('正在分析，请勿刷新……').css({'line-height':$(window).height()+'px'});
    console.time('分析计时');
    $.ajax({
        url:'/startAnalysis?fileName='+fileName,
        type:'get',
        success:function (result) {
            console.log('解析结果: ',result);
            console.timeEnd('分析计时');
            if(result.isSuccess){
                $('.promptInfo').hide();
                initResultList(result.firstArray,result.secondArray);
            }else{
                $('.promptInfo').text('文件解析失败,请刷新页面重新上传！');
            }
        },
        error:function (error) {
            $('.promptInfo').text('和服务器端通讯失败，请刷新页面重新上传！');
        }
    });
}

function cancelUpload(fileName,targetID){
    $('#upload_mask').remove();
    $('#upload_progressDiv').remove();
    $('#'+targetID).show();
    xhr.abort();
    $.ajax({
        url:'/deleteUploadFile?fileName='+fileName,
        type:'get',
        success:function (result) {
            console.log(result);
        }
    });
}