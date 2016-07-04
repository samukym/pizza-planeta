var controllers = require('../controllers');

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    //TODO: Probar si funciona la conexión con el cliente iOs
    console.log('someone connected');
    socket.emit('mensajito', {
      mensaje: 'holi'
    });
    socket.on('otro evento', function(data) {
      console.log(data);
    });

    //TODO
    socket.on('actualizar ubicacion', function(data) {
      console.log(data);

    });
    //TODO
    socket.on('disconnect', function() {

    });
  });

}
