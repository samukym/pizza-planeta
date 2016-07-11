"use strict()";
var Pedido = require('mongoose').model('Pedido');
var Google = require('../services/googleService');

function getDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

module.exports = {
  getDistance: getDistance,
  updateRutaPedido: function(idPedido, latitud, longitud, cb) {
    Pedido.findById(idPedido, function(err, pedido) {
      if (err) {
        console.log('error en findById: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!pedido) {
        console.log('Incorrect');
        res.send({
          error: true,
          message: 'Pedido no encontrado'
        });
        return;
      }

      var distance = getDistance(pedido.direccion.latitud, pedido.direccion.longitud, latitud, longitud);
      if (distance <= 5 && pedido.coEst !== 51) {
        pedido.estado = "Llegando";
        pedido.coEst = 51;
      } else if (distance < 1 && pedido.coEst !== 52) {
        pedido.estado = "Su pizza ha llegado";
        pedido.coEst = 52;
      }

      pedido.latitud = latitud;
      pedido.longitud = longitud;

      Google.getRuta(pedido.direccion.latitud, pedido.direccion.longitud,
        latitud, longitud,
        function(err, ruta) {
          if (err) {
            rej(err);
          } else if (!ruta) {
            rej(Error("No ruta disponible"));
          }
          pedido.ruta = ruta;
          pedido.save();
          cb(pedido);
        });
    });
  }
};
