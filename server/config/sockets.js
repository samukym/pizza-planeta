var routes = require('../utils/routesAndDistance');

var io = null;

module.exports = {
  enviarPedidoActualizadoSocket: function(pedido) {
    io.toRoom(pedido._id).emit('pedidoActualizado', pedido);
    io.toRoom(pedido.tiendaId).emit('pedidoActualizado', pedido);
  },
  init: function(server) {
    io = require('socket.io')(server);

    var enviarPedidoActualizadoSocket = function(pedido) {
      io.toRoom(pedido._id).emit('pedidoActualizado', pedido);
    };

    io.of('/socketMotorizado')
      .on('connection', function(socket) {
        console.log("Conexion entrante actualizarPedido..");

        var currentPedidoId = "";

        //cuando el cliente confirma pedido
        socket.on('iniciar', function(data) {
          // validar token data.token
          // considerar conseguir id pedido por token de motori<.
          currentPedidoId = data.pedidoId;
          //TODO
          currentPedido = {'Pedido': 'yay'};
          socket.join(currentPedidoId);
          socket.emit('pedidoActualizado', currentPedido);
        });
        //TODO
        socket.on('actualizarUbicacion', function(data) {
          console.log(data);
          //data.lat, data.lon
          routes.updateRutaPedido(currentPedidoId, data.latitud, data.longitud,
            function(pedido) {
              socket.emit('pedidoActualizado', pedido);
            });
        });
        //TODO
        socket.on('disconnect', function() {
          //botar
        });
      });

    io.of('/socketUsuario')
      .on('connection', function(socket) {
        var currentPedidoId = "";

        socket.on('iniciar', function(data) {
          // validar token data.token
          // considerar conseguir id pedido por token de motori<.
          currentPedidoId = data.pedidoId;
          //TODO
          currentPedido = null;
          socket.join(currentPedidoId);
          socket.emit('pedidoActualizado', currentPedido);
        });
        //TODO
        socket.on('disconnect', function() {
          //botar
        });
      });

    io.of('/socketTienda')
      .on('connection', function(socket) {
        var currentTiendaId = "";

        socket.on('iniciar', function(data) {
          // validar token data.token
          // considerar conseguir id pedido por token de motori<.
          currentTiendaId = data.tiendaId;
          //TODO
          socket.join(currentTiendaId);
          socket.emit('ack', 'connected');
        });
        //TODO
        socket.on('disconnect', function() {
          //botar
        });
      });

  }
};
