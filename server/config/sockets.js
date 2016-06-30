module.exports = function(app) {
  var io = require('socket.io')(app);

  io.on('connection', function (socket) {
    socket.emit('mensajito', { mensaje: 'holi' });
    socket.on('otro evento', function (data) {
      console.log(data);
    });
  });
}
