
/**
 * Module dependencies.
 */
require('./modules/Config');

var express = require('express')
    ,app = express()
    ,http = require('http')
    ,server=http.createServer(app)
    ,io = require('socket.io').listen(server); //创建socket

exports.io=io;

var routes = require('./routes')
    ,FLog = require('./modules/log').create()
    ,path = require('path')
    ,fs=require("fs");

server.listen(global.listenerPort);

app.engine('html', require('ejs').renderFile);

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/upload',routes.upload);
app.get('/deleteUploadFile',routes.deleteUploadFile);
app.get('/emptyUploadedFile',routes.emptyUploadedFile);
app.get('/startAnalysis',routes.startAnalysis);

function isDirExists(dirPath){
    fs.exists(dirPath, function(exists){
        return exists;
    });
}

if(!isDirExists(__dirname+'/upload')){fs.mkdir(__dirname+'/upload', 0777);}
if(!isDirExists(__dirname+'/download')){fs.mkdir(__dirname+'/download', 0777);}

io.on('connection', function (socket) {
    FLog.info("io.open: ", io.open);
    socket.on('disconnect', function(){
        FLog.info("the connect has stop!");
        io.emit('message',{state:'页面刷新成功!'});
    });
    FLog.info('the connect '+socket.id+' is fine!');
});


FLog.info("Express server listening on port :" + global.listenerPort);