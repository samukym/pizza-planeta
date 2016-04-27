var controllers = require('../controllers'),
    middleware = require('./middleware');

module.exports = function(app) {
    app.post('/crearUsuario', controllers.usuario.crearUsuario);
    app.post('/loginUsuario', controllers.usuario.login);
    app.post('/logoutUsuario', middleware.validTokenUsuario, controllers.usuario.logout);
    app.post('/usuario', middleware.validTokenUsuario, controllers.usuario.findUsuario);
    app.post('/agregarDireccion', middleware.validTokenUsuario, controllers.usuario.agregarDireccion);
    app.get('/usuarios', controllers.usuario.find);

    app.get('/pizzas', controllers.pizza.find);
    // app.get('/crearpizzas', controllers.pizza.crearPizzas);

    app.post('/pedidosUsuario', middleware.validTokenUsuario, controllers.pedido.findPedidosUsuario);
    app.post('/carritoUsuario', middleware.validTokenUsuario, controllers.pedido.findCarrito);
    app.post('/agregarPizzaCarrito', middleware.validTokenUsuario, middleware.findPizza, controllers.pedido.agregarPizzaCarrito);

    app.post('/loginMotorizado', controllers.motorizado.login);
    app.post('/logoutMotorizado', middleware.validTokenMotorizado, controllers.motorizado.logout);
    app.post('/motorizado', middleware.validTokenMotorizado, controllers.motorizado.findMotorizado);

    app.post('/loginTienda', controllers.tienda.login);
    app.post('/logoutTienda', middleware.validTokenTienda, controllers.tienda.logout);
    app.post('/tienda', middleware.validTokenTienda, controllers.tienda.findTienda);
    app.get('/tiendas', controllers.tienda.find);
    app.get('/creartiendas', controllers.tienda.crearTiendas);

    app.get('/', function (req, res) {
        res.render('index', {currentUser: req.session.user});
    });

    app.get('*', function (req, res) {
        res.render('index', {currentUser: req.session.user});
    });
};
