/*jshint node: true */
"use strict()";

var express = require('express');

var env = process.env.NODE_ENV || 'test';
var config = require('./server/config/config')[env];

var app = module.exports = express();
var server = require('http').Server(app);

require('./server/config/mongoose')(config);
require('./server/config/express')(app, config);
var socketMaster = require('./server/config/sockets');
socketMaster.init(server);
require('./server/config/routes')(app, socketMaster);

server.listen(config.port);
console.log("Server running on port: " + config.port);

app.get('/socket', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
