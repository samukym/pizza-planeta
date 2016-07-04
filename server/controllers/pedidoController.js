/*jshint node: true */
"use strict()";

var Tienda = require('mongoose').model('Tienda'),
  Pedido = require('mongoose').model('Pedido'),
  Pizza = require('mongoose').model('Pizza'),
  Google = require('../services/googleService'),
  Distance = require('../services/distanceService'),
  qr = require('qr-image');

function getTiendaCercana(pedido) {
  return new Promise(function(res, rej) {
    Tienda.getTiendaCercana(pedido.direccion.latitud,
      pedido.direccion.longitud,
      function(err, tienda) {
        if (!tienda) {
          rej(err);
        }
        res(tienda);
      });
  });
}

function getRutaTienda(pedido) {
  return new Promise(function(res, rej) {
    Tienda.findOne({
      _id: pedido.tiendaId
    }, function(err, tienda) {
      if (!tienda) {
        rej(Error("no tienda"));
        return;
      } else if (err) {
        rej(err);
        return;
      }
      Google.getRuta(pedido.direccion.latitud, pedido.direccion.longitud,
        tienda.direccion.latitud,
        tienda.direccion.longitud,
        function(err, ruta) {
          if (err) {
            rej(err);
          } else if (!ruta) {
            rej(Error("No ruta disponible"));
          }
          res(ruta);
        });
    });
  });
}

module.exports = {
  // findPedidosHistoricosUsuario: (tokenUsuario) / (lista de pedidos)
  findPedidosUsuario: function(req, res) {
    console.log(req.session.user._id);
    Pedido.find({
      usuarioId: req.session.user._id
    }).exec(function(err, pedidos) {
      if (err) {
        console.log('error en find: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!pedidos) {
        res.send({
          error: true,
          message: 'Pedidos no encontrados'
        });
      }
      return res.json(pedidos);
    });
  },
  // findCarrito: (tokenUsuario) /(pedido activo)
  findCarrito: function(req, res) {
    Pedido.findOne({
      usuarioId: req.session.user._id,
      coEst: 0
    }).exec(function(err, pedido) {
      if (err) {
        console.log('error en find: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!pedido) {
        res.send({
          error: true,
          message: 'No hay ningún pedido activo'
        });
        return;
      }

      return res.json(pedido);
    });
  },
  // agregarPizzaCarrito: (tokenUsuario, idTienda, idPizza, codTamano, cantidad, comentario)/(pedido actualizado)
  //primero pasa por el middleware donde se settea req.nuevaPizza
  agregarPizzaCarrito: function(req, res) {
    Pedido.findOne({
      usuarioId: req.session.user._id,
      coEst: 0
    }).exec(function(err, pedido) {
      if (err) {
        console.log('error en find: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      //SI NO HAY UN PEDIDO CREADO, SE CREA AL MOMENTO DE AGREGAR LA PRIMERA PIZZA
      if (!pedido) {
        pedido = new Pedido({
          usuarioId: req.session.user._id,
          estado: "Sin confirmar",
          coEst: 0
        });
        pedido.save(function(err, pedido) {
          if (err) {
            res.send({
              error: true,
              message: 'Oops! Ocurrió un error'
            });
            return;
          }
          console.log('Pedido creado', pedido);
        });
      }
      console.log(req.nuevaPizza);

      pedido.pizzas.push(req.nuevaPizza);

      pedido.save(function(err) {
        if (err) {
          console.log("No se pudo insertar la pizza en pedido");
        }
      });
      return res.json(pedido);
    });
  },
  // quitarPizzaCarrito: (tokenUsuario, idPizza, idPedido)/(pedido actualizado)
  quitarPizzaCarrito: function(req, res) {
    Pedido.findOne({
      usuarioId: req.session.user._id,
      coEst: 0
    }).exec(function(err, pedido) {
      if (err) {
        console.log('error en quitarPizzaCarrito: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      } else if (!pedido) {
        res.send({
          error: true,
          message: 'Pedido no encontrado'
        });
        return;
      } else if (pedido.estado != "Sin confirmar") {
        res.send({
          error: true,
          message: 'No puedes eliminar una pizza si el pedido ya ha sido confirmado'
        });
        return;
      } else {
        Pedido.update({
            _id: pedido._id
          }, {
            $pull: {
              pizzas: {
                _id: req.body.idPizzaCarrito
              }
            }
          },
          function(err) {
            if (err) {
              res.send({
                error: true,
                message: "Pizza no existe en el carrito"
              });
              return;
            } else {
              res.send({
                message: "OK"
              });
              return;
            }
          });
      }
    });
  },

  // confirmarCarrito: (tokenUsuario,comentarioPedido,idDireccion,codReciboVisa)/(pedido con tienda dentro | msgError)
  confirmarCarrito: function(req, res) {
    Pedido.findOne({
      usuarioId: req.session.user._id
    }, function(err, pedido) {
      if (err) {
        res.send({
          error: true,
          message: "Error en la busqueda del carrito"
        });
        return;
      } else if (!pedido) {
        res.send({
          error: true,
          message: "Pizza no existe en el carrito"
        });
        return;
      }
      if (pedido.estado != 'Sin confirmar') {
        res.send({
          error: true,
          message: "el pedido tiene que estar sin confirmar"
        });
        return;
      }
      var precioTotal = 0;
      for (var i = 0; i < pedido.pizzas.length; i++) {
        precioTotal += pedido.pizzas[i].tamano.precio;
      }
      var precioSubtotal = precioTotal * 0.82;
      var precioIgv = precioTotal * 0.18;

      pedido.precioSubtotal = precioSubtotal;
      pedido.precioIgv = precioIgv;
      pedido.precioTotal = precioTotal;
      pedido.comentario = req.body.comentarioPedido;
      pedido.fecha = new Date();
      pedido.codReciboVisa = req.body.codReciboVisa;
      pedido.estado = "Confirmado";
      pedido.coEst = 10;

      var direccion = {};
      for (var i = 0; i < req.session.user.direcciones.length; i++) {
        if (req.session.user.direcciones[i]._id === req.body.idDireccion) {
          direccion = req.session.user.direcciones[i];
          break;
        }
      }
      pedido.direccion = direccion;

      getTiendaCercana(pedido).then(function(tienda) {
          pedido.tiendaId = tienda._id;
          pedido.latitud = tienda.direccion.latitud;
          pedido.longitud = tienda.direccion.longitud;
          return pedido;
        })
        .then(function(pedido) {
          return getRutaTienda(pedido).then(function(ruta) {
            pedido.ruta = ruta;
            return pedido;
          }, function(err) {
            res.send({
              error: true,
              message: "No se pudo obtener la ruta"
            });
            return;;
          });
        })
        .then(function(pedido) {
          pedido.estado = "Confirmado";
          pedido.save();
          return res.json(pedido);
        }, function(err) {
          res.send({
            error: true,
            message: "No se pudo confirmar el pedido"
          });
          return;
        });
    });
  },
  //findPedidosActivosTienda: (tokenTienda) / (lista de pedidos),
  findPedidosActivosTienda: function(req, res) {
    console.log(req.session.user._id);
    Pedido.find({
      tiendaId: req.session.user._id
    }).exec(function(err, pedidos) {
      if (err) {
        console.log('error en find: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!pedidos) {
        res.send({
          error: true,
          message: 'Pedidos no encontrados'
        });
        return;
      }
      return res.json(pedidos);
    });
  },
  // asignarMotorizado: (tokenMotorizado, idPedido) / (pedido)
  asignarMotorizado: function(req, res) {
    Pedido.findById(req.body.idPedido, function(err, pedido) {
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
      pedido.motorizado = {
        nombre: req.session.user.nombre,
        telefono: req.session.user.telefono,
        email: req.session.user.email,
        dni: req.session.user.dni,
        placa: req.session.user.placa
      }
      pedido.estado = 'En camino';
      pedido.coEst = 50;
      pedido.save();
      return res.json(pedido);
    });
  },
  // findPedidoAsignadoMotorizado: (tokenMotorizado) / (pedido activo | msgError),
  findPedidoAsignadoMotorizado: function(req, res) {
    console.log(req.session.user._id);
    var motorizado = {
      nombre: req.session.user.nombre,
      telefono: req.session.user.telefono,
      email: req.session.user.email,
      dni: req.session.user.dni,
      placa: req.session.user.placa
    }
    Pedido.findOne({
      motorizado: motorizado
    }).exec(function(err, pedido) {
      if (err) {
        console.log('error en find: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!pedidos) {
        res.send({
          error: true,
          message: 'Pedidos no encontrados'
        });
        return;
      }
      return res.json(pedido);
    });
  },
  // actualizarEstadoPedidoTienda: (tokenTienda, idPedido, coEst, estado) / (lista de pedidos),
  actualizarEstadoPedidoTienda: function(req, res) {
    Pedido.findById(req.body.idPedido, function(err, pedido) {
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
      pedido.estado = req.body.estado;
      pedido.coEst = req.body.coEst;
      pedido.save();
      return res.json(pedido);
    });
  },
  getQrCode: function(req, res) {
    var code = qr.image(req.params.pedidoId, {
      type: 'png'
    });
    res.type('png');
    code.pipe(res);
  },
  // actualizarEstadoPedidoMotorizado: (tokenMotorizado, idPedido, coEst, estado) / (pedido)
  actualizarEstadoPedidoMotorizado: function(req, res) {
    Pedido.findById(req.body.idPedido, function(err, pedido) {
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
      pedido.estado = req.body.estado;
      pedido.coEst = req.body.coEst;
      pedido.save();
      return res.json(pedido);
    });
  },

  //actualizar ubicacion: (tokenMotorizado, idPedido, latitud, longitud) / (pedido)
  actualizarUbicacion: function(req, res) {
    Pedido.findById(req.body.idPedido, function(err, pedido) {
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

      var distance = Distance.getDistance(pedido.direccion.latitud, pedido.direccion.longitud, req.body.latitud, req.body.longitud);
      if (distance <= 5 && pedido.coEst !== 51) {
        pedido.estado = "Llegando";
        pedido.coEst = 51;
      } else if (distance < 1 && pedido.coEst !== 52) {
        pedido.estado = "Su pizza ha llegado";
        pedido.coEst = 52;
      }

      pedido.latitud = req.body.latitud;
      pedido.longitud = req.body.longitud;
      pedido.save();
      return res.json(pedido);
    });
  }
};
