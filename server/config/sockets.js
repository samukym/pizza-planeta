var controllers = require('../controllers');

module.exports = function(app) {
  var io = require('socket.io')(app);

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
