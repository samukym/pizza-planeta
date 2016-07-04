/*jshint node: true */
"use strict()";

var express = require('express');

var env = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[env];

var app = module.exports = express();
var server = require('http').Server(app);

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/sockets')(server);
require('./server/config/routes')(app);

server.listen(config.port);
console.log("Server running on port: " + config.port);
