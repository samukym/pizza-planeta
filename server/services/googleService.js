/*jshint node: true */
"use strict";

// var config = require('../../server').config;
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var request = require('request');
var url = 'https://maps.googleapis.com/maps/api/directions/json';

module.exports = {
  getRuta: function(lat1, lng1, lat2, lng2) {
    var origin = lat1 + ',' + lng1;
    var destination = lat2 + ',' + lng2;
    var propertiesObject = {
      origin : origin,
      destination : destination,
      key : config.googleApiKey
    };
    request({
      url: url,
      qs: propertiesObject,
      json: true
    }, function(err, response, body) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Get response: " + response.statusCode);
      console.log(body.routes[0].legs[0]);
      var ruta = {
        tiempo: body.routes[0].legs[0].steps[0].duration.value,
        distancia: body.routes[0].legs[0].steps[0].distance.value,
        points: body.routes[0].legs[0].steps[0].polyline.points
      }
      console.log(ruta);
      return ruta;
    });
  }
};
