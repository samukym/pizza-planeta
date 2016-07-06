var controllers = require('../controllers');


module.exports = function(server) {
  var io = require('socket.io')(server);
  let idPedido=0;
  io.of('/actualizarPedido')
  .on('connection', function(socket) {
    console.log("Conexion entrante actualizarPedido..");
    socket.on('saludo', function(data) {
      idPedido = data.pedido.id;
      if(idPedido == 'asdf'){
        socket.join(data.pedido.id);
      }
    });
    //TODO
    socket.on('actualizar_pedido', function(data) {
      console.log(data);

    });
    //TODO
    socket.on('disconnect', function() {

    });
  });

  io.of('/actualizarUbicacion')
  .on('connection', function(socket) {
      
  });
}
