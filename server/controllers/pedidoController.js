var Tienda = require('mongoose').model('Tienda'),
  Pedido = require('mongoose').model('Pedido'),
  Pizza = require('mongoose').model('Pizza'),
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
      // agregarPizzaCarrito: (tokenUsuario, idPizza,codTamano, cantidad, comentario)/(pedido actualizado)
      agregarPizzaCarrito: function(req, res) {
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
            }
            if (!pedido) {
              res.send({
                error: true,
                message: 'No hay ningún pedido activo'
              });
            }
            pedido.pizzas.push(req.nuevaPizza);
            pedido.save();
            return res.json(pedido);
          });
        }
      // quitarPizzaCarrito: (tokenUsuario, idPizzaCarrito)/(pedido actualizado),
      // confirmarCarrito: (tokenUsuario, idPedido,comentarioPedido,idDireccion,codReciboVisa)/(pedido con tienda dentro | msgError),
    // findPedidosActivosTienda: (tokenTienda) / (lista de pedidos),
    // findPedidoAsignadoMotorizado: (tokenMotorizado) / (pedido activo | msgError),
    // actualizarEstadoPedidoTienda: (tokenTienda, idPedido, nuevoEstado) / (lista de pedidos),
    // actualizarEstadoPedidoMotorizado: (tokenMotorizado, idPedido, nuevoEstado, ubicacion) / (pedido)
};
