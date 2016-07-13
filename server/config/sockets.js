var updateRoute = require('../utils/updateRoute');
var auth = require('../utils/auth');

var io = null;

module.exports = {
  enviarPedidoActualizadoSocket: function(pedido) {
    io.to(pedido._id).emit('pedidoActualizado', pedido);
    io.to(pedido.tiendaId).emit('pedidoActualizado', pedido);
  },
  init: function(server) {
    io = require('socket.io')(server);

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
          updateRoute(currentPedidoId, data.latitud, data.longitud,
            function(pedido) {
              socket.emit('pedidoActualizado', pedido);
            });
        });
        //TODO

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

      });

    io.of('/socketTienda')
      .on('connection', function(socket) {
        var currentTiendaId = "";

        socket.on('iniciar', function(data) {
          // validar token data.token
          // considerar conseguir id tienda por token de tienda
          if(!data.token){
            console.log("token no recibido");
            return;
          }
          auth.validTokenTienda(data.token, function(err, tienda){
            if(err){
              console.log("error validando tienda");
              return;
            }
            currentTiendaId = tienda._id;
            socket.join(currentTiendaId);
            socket.emit('ack', 'connected');
          });
        });

      });

  }
};
