/*jshint node: true */
"use strict";

var Tienda = require('mongoose').model('Tienda'),
  Pedido = require('mongoose').model('Pedido'),
  Pizza = require('mongoose').model('Pizza'),
  Google = require('../services/googleService'),
  app = require('../../server');

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
    console.log(req.session.user._id);
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
      }
      return res.json(pedido);
    });
  },
  // agregarPizzaCarrito: (tokenUsuario, idPedido, idPizza, codTamano, cantidad, comentario)/(pedido actualizado)
  //primero pasa por el middleware donde se settea req.nuevaPizza
  agregarPizzaCarrito: function(req, res) {
    if (!req.body.idPedido) {
      var pedido = new Pedido({
        usuarioId: req.session.user._id,
        pizzas: [req.nuevaPizza],
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
        return res.json(pedido);
      });
    } else {
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
        pedido.pizzas.push(req.nuevaPizza);
        pedido.save();
        return res.json(pedido);
      });
    }
  },
  // quitarPizzaCarrito: (tokenUsuario, idPizza, idPedido)/(pedido actualizado)
  quitarPizzaCarrito: function(req, res) {
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
      for (var i = 0; i < pedido.pizzas.length; i++) {
        if (pedido.pizzas[i]._id === req.body.idPizza) {
          pedido.pizzas.splice(i, 0);
          break;
        }
      }
      pedido.save();
      return res.json(pedido);
    });
  },
  // confirmarCarrito: (tokenUsuario, idPedido,comentarioPedido,idDireccion,codReciboVisa)/(pedido con tienda dentro | msgError)
  confirmarCarrito: function(req, res) {
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
      var precioTotal = 0;
      for (var i = 0; i < pedido.pizzas.length; i++) {
        precioTotal += pedido.pizzas[i].tamano.precio;
      }
      var precioSubtotal = precioTotal * 0.82;
      var precioIgv = precioTotal * 0.18;
      var direccion = {};
      for (var i = 0; i < req.session.user.direcciones.length; i++) {
        if (req.session.user.direcciones[i]._id === req.body.idDireccion) {
          var direccion = req.session.user.direcciones[i];
          break;
        }
      }
      pedido.precioSubtotal = precioSubtotal;
      pedido.precioIgv = precioIgv;
      pedido.precioTotal = precioTotal;
      pedido.comentario = req.body.comentarioPedido;
      pedido.fecha = new Date();
      pedido.direccion = direccion;
      pedido.tiendaId = Tienda.getTiendaCercana(direccion.latitud, direccion.longitud)._id;
      pedido.codReciboVisa = req.body.codReciboVisa;
      pedido.estado = "Confirmado";
      pedido.coEst = 10;
      pedido.ruta = Google.getRuta(direccion.latitud, direccion.longitud,
        Tienda.getTiendaCercana(direccion.latitud, direccion.longitud).direccion.latitud,
        Tienda.getTiendaCercana(direccion.latitud, direccion.longitud).direccion.longitud);
      pedido.save();
      return res.json(pedido);
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
      pedido.coEst = 5;
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
  // actualizarEstadoPedidoMotorizado: (tokenMotorizado, idPedido, coEst, estado, ubicacion) / (pedido)
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
      //actualizar ubicacion
      pedido.save();
      return res.json(pedido);
    });
  }
};
