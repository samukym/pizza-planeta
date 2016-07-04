var controllers = require('../controllers'),
  middleware = require('./middleware');

module.exports = function(app) {
  app.post('/crearUsuario', controllers.usuario.crearUsuario);
  app.post('/loginUsuario', controllers.usuario.login);
  app.post('/logoutUsuario', middleware.validTokenUsuario, controllers.usuario.logout);
  app.post('/usuario', middleware.validTokenUsuario, controllers.usuario.findUsuario);
  app.post('/agregarDireccion', middleware.validTokenUsuario, controllers.usuario.agregarDireccion);
  app.get('/usuarios', controllers.usuario.find);


  app.post('/pedidosUsuario', middleware.validTokenUsuario, controllers.pedido.findPedidosUsuario);
  app.post('/carritoUsuario', middleware.validTokenUsuario, controllers.pedido.findCarrito);
  app.post('/agregarPizzaCarrito', middleware.validTokenUsuario, middleware.findPizza, controllers.pedido.agregarPizzaCarrito);
  app.post('/quitarPizzaCarrito', middleware.validTokenUsuario, controllers.pedido.quitarPizzaCarrito);
  app.post('/confirmarCarrito', middleware.validTokenUsuario, controllers.pedido.confirmarCarrito);

  app.post('/findPedidosActivosTienda', middleware.validTokenTienda, controllers.pedido.findPedidosActivosTienda);
  app.post('/actualizarEstadoPedidoTienda', middleware.validTokenTienda, controllers.pedido.actualizarEstadoPedidoTienda);
  app.get('/getQrCode/:pedidoId', controllers.pedido.getQrCode);

  app.post('/asignarMotorizado', middleware.validTokenMotorizado, controllers.pedido.asignarMotorizado);
  app.post('/findPedidoAsignadoMotorizado', middleware.validTokenMotorizado, controllers.pedido.findPedidoAsignadoMotorizado);
  app.post('/actualizarEstadoPedidoMotorizado', middleware.validTokenMotorizado, controllers.pedido.actualizarEstadoPedidoMotorizado);


  app.post('/loginMotorizado', controllers.motorizado.login);
  app.post('/logoutMotorizado', middleware.validTokenMotorizado, controllers.motorizado.logout);
  app.post('/motorizado', middleware.validTokenMotorizado, controllers.motorizado.findMotorizado);


  app.post('/loginTienda', controllers.tienda.login);
  app.post('/logoutTienda', middleware.validTokenTienda, controllers.tienda.logout);
  app.post('/tienda', middleware.validTokenTienda, controllers.tienda.findTienda);
  // app.post('/pedidosActivosTienda', middleware.validTokenTienda, controllers.tienda.findPedidosActivosTienda);
  app.get('/tiendas', controllers.tienda.find);
  // app.get('/creartiendas', controllers.tienda.crearTiendas);


  app.get('/pizzas', controllers.pizza.find);
  // app.get('/crearpizzas', controllers.pizza.crearPizzas);

  // app.get('*', function (req, res) {
  //         res.sendFile('../../public/index.html');
  //     });
};
