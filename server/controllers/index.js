var pizzaController = require('./pizzaController'),
  usuarioController = require('./usuarioController'),
  pedidoController = require('./pedidoController'),
  tiendaController = require('./tiendaController'),
  motorizadoController = require('./motorizadoController');

module.exports = {
  pizza: pizzaController,
  usuario: usuarioController,
  pedido: pedidoController,
  tienda: tiendaController,
  motorizado: motorizadoController
};
