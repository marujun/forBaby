/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-8-2
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */

function initSocketWithIPAndPort(ip,port){
    var socket;
    socket = io.connect(ip+':'+port,{'reconnect':true,'reconnection delay':50,'auto connect':true});
    socket.on('refresh',function(data){
        console.log("the client received message is:",data.state);
        location.href =ip+':'+port;
    });
    socket.on('message',function(data){
        console.log("the client received message is:",data);
    });
    socket.on('disconnect', function(){
        console.log('连接已断开!');
    });
    socket.on('reconnect', function() {
        console.log("socket has reconnect");
    });
    socket.on('connect',function(){
        console.log("the client has connect with server !");
    });
}


function initResultList(firstArray,secondArray){
    $('.resultList').show().find('div table').remove();
    console.time('渲染计时');
    var firstTable='<table class="resultList_firstTable" border="1px" bordercolor="#000000" cellspacing="0px" ><tr><td style="text-align: center;">第一列（包含excel的标题共'+firstArray.length+'行）</td></tr>';
    for(var i=0;i<firstArray.length;i++){
        if(firstArray[i]!=''){
            firstTable+='<tr><td class="firstTd">'+firstArray[i]+'</td></tr>';
        }
    }
    firstTable+='</table>';
    $('.firstRow').append(firstTable);
    var secondTable='<table class="resultList_secondTable" border="1px" bordercolor="#000000" cellspacing="0px" > <tr><td style="text-align: center;">第二列（包含excel的标题共'+secondArray.length+'行）</td></tr>';
    for(var j=0;j<secondArray.length;j++){
        if(secondArray[j]!=''){
            secondTable+='<tr><td class="secondTd">'+secondArray[j]+'</td></tr>';
        }
    }
    secondTable+='</table>';
    $('.secondRow').append(secondTable);
    console.timeEnd('渲染计时');
}