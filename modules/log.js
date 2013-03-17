
var fs = require('fs');



var cwd = process.cwd() + '/',

    INFO = 0;

DEBUG = 1;

WARNING = 2;

ERROR = 3;

TRACE = 4;

INIT = 6;

type = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'TRACE', '', 'LOG_INIT'];

colors = [38, 34, 35, 31, 32, 36, 33];

bufferSize = 20000;

writeSize = 16384;



exports.INFO = INFO;

exports.DEBUG = DEBUG;

exports.WARNING = WARNING;

exports.ERROR = ERROR;

exports.TRACE = TRACE;



function getPos() {

    try {

        throw new Error();

    } catch(e) {

        var pos=e.stack.split('\n')[4];

        if(pos.split('(').length>1){

            pos = pos.split('(')[1].split(')')[0].split(':');

        }else{

            pos = pos.split('at ')[1].split(':');

        }

        pos=pos[0].replace(cwd, '') + ':' + pos[1];

        return pos;
    }
}



function pad2(num) {

    return num > 9 ? num : '0' + num;

}



function getTime() {

    var t = new Date();

    return [t.getFullYear(), '-', pad2(t.getMonth() + 1) , '-', pad2(t.getDate()), ' ',

        pad2(t.getHours()), ':', pad2(t.getMinutes()), ':', pad2(t.getSeconds())].join('');

}

function addArgumentsBefore(data,arguments){

    var args = Array.prototype.slice.call(arguments);

    var afterData={};

    afterData[0]=data;

    for(var i=0;i<args.length;i++){

        afterData[i+1]=args[i];

    }
    afterData['length']=args.length+1;

    return afterData;
}

function formatLog(log, color) {

    var tag = head = foot = '';

    if (color) {

        head = '\x1B[';

        foot = '\x1B[0m';

        tag = colors[5]+'m';

        color = colors[log.type]+'m';

    }

    var message='';

    for(var key in log.msg){

        var value=log.msg[key];

        if(typeof value=='object'){

            if(JSON.stringify(value)!=='{}'){

                message+=' '+JSON.stringify(value);

            }else{

                message+=' '+value.toString();

            }

        }else{

            message+=' '+value;

        }
    }
    return [log.time, ' [', head, color, type[log.type], foot, '] [', head, tag, log.pos, foot, ']  ', message].join('');
}



exports.create = function(level, file) {

    if (!level) {

        level = INFO;

    }

    if (file) {

        var buffer = new Buffer(bufferSize);

        var pos = 0;

        var fd = fs.openSync(file, 'a');

        process.on('exit', function(){

            fs.writeSync(fd, buffer, 0, pos, null);

        })

    }

    function log(type, msg) {

        if (type < level){

            return;

        }

        var log = {type:type, msg:msg, time:getTime(), pos:getPos()};

        var header=formatLog(log, true).split(']  ')[0]+']';

        console.log.apply(console, addArgumentsBefore(header,msg));

        if (file) {

            if (pos >= writeSize) {

                fs.writeSync(fd, buffer, 0, pos, null);

                pos = 0;

            }

            pos += buffer.write(formatLog(log) + "\r\n", pos);

        }

    }

//    console.log(formatLog({type:INIT, pos:file, time:getTime(), msg: 'log init with level ' + type[level]}, true));

    return {

        info : function() {log(INFO, arguments);},

        debug : function() {log(DEBUG, arguments);},

        warning : function() {log(WARNING, arguments);},

        error : function() {log(ERROR, arguments);},

        trace : function() {log(TRACE, arguments);}

    };

};