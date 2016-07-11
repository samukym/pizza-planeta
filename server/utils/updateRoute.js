"use strict()";
var Pedido = require('mongoose').model('Pedido');
var Google = require('../services/googleService');

module.exports = function(idPedido, latitud, longitud, cb) {
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
};
