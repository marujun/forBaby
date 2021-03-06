
/*
 * GET home page.
 */
require('../modules/Config');

var FLog = require('../modules/log').create(),
    fs=require("fs"),
    io=require('../app').io,
    util = require('util'),
    moment = require('moment'),
    rmdir=require ('./rmdirSync').rmdirSync,
    parseExcel=require('./excel').parseExcel;

exports.index = function(req, res){
    var url=req.headers.host;
    var clientIP="http://"+url.substring(0,url.indexOf(':'+global.listenerPort,0));
    FLog.info('clientIP : '+clientIP);
    res.render('index', {cilentIP:clientIP,port:global.listenerPort });
};

exports.startAnalysis = function(req, res){
    var filePath=__dirname+'/../upload/' +req.query.fileName.replace(/\s+/g,'_');
    parseExcel(filePath,function(doc){
        FLog.info('parse result: '+ JSON.stringify(doc));
        res.send(doc);
        rmdir(filePath,function(){});
    });
};

exports.upload=function(req,res){
    var tmp_path = req.files.uploadFile.path; // 获得文件的临时路径
//    var dateStr=moment(new Date()).format("___YYYY-MM-DD__HH:mm:ss.SSS");
    var fileName=req.files.uploadFile.name.replace(/\s+/g,'_');
//    FLog.info('upload fileName: '+fileName);
    var target_path = __dirname+'/../upload/' +fileName;// 指定文件上传后的目录

    var tempStream = fs.createReadStream(tmp_path);
    var targetStream = fs.createWriteStream(target_path);

    util.pump(tempStream, targetStream, function(err) {
        if(err){FLog.info("上传文件错误:"+err);}
        fs.unlinkSync(tmp_path);
        res.send({fileName:fileName});
    });

//    fs.rename(tmp_path, target_path, function(err) { // 移动文件
//        if (err){ FLog.error("上传文件失败 error :"+err);
//        }else{ FLog.info("上传文件："+target_path+"成功!"); }
//        rmdir(tmp_path,function(){  // 删除临时文件夹文件,
//            FLog.info("删除临时文件 :"+tmp_path +"  成功!");
//        });
//        res.end();
//    });
};

exports.deleteUploadFile=function(req,res){
    var filePath =  __dirname+'/../upload/' +req.query.fileName;
    rmdir(filePath,function(){  // 删除文件,
        FLog.info("删除文件 :"+filePath +"  成功!");
        res.send({message:'删除文件成功！'})
    });
};

exports.emptyUploadedFile=function(req,res){
    var filePath =  __dirname+'/../upload/';
    rmdir(filePath,function(){   // 删除文件夹
        FLog.info("删除文件夹 :"+filePath +"  成功!");
        fs.mkdir(__dirname+'/../upload', 0777);
        res.send({message:'清空上传文件夹成功！'})
    });
};