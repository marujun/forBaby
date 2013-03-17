require('./Config');
var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var Provider = function () {
};

Provider.prototype.db = new Db(global.mongodbDB, new Server(global.mongodbHost, global.mongodbPort, {auto_reconnect: true, poolSize: 10}), {w:0, native_parser: false});

exports.Provider = Provider;