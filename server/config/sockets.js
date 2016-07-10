var controllers = require('../controllers');

/*
* ESTRUCTURA SOCKETS
*
* 
*   
*
*/

module.exports =  function(server) {
  var io = require('socket.io')(server);

  io.of('/actualizarPedido')
  .on('connection', function(socket) {
    console.log("Conexion entrante actualizarPedido..");
    socket.on('loginTienda', function(data){
      //comprobar token

    });
    //cuando el cliente confirma pedido
    socket.on('nuevoPedido', function(data){
      socket.join(data.pedido.id);
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
