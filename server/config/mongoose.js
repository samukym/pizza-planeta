var mongoose = require('mongoose'),
  PizzaModel = require('../data/models/Pizza'),
  UsuarioModel = require('../data/models/Usuario'),
  MotorizadoModel = require('../data/models/Motorizado'),
  TiendaModel = require('../data/models/Tienda'),
  PedidoModel = require('../data/models/Pedido');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.once('open', function(err) {
        if (err) {
            console.log('Database could not be opened: ' + err);
            return;
        }
        console.log('Database up and running...');
    });

    db.on('error', function(err){
        console.log('Database error: ' + err);
    });

    PizzaModel.init();
    UsuarioModel.init();
    MotorizadoModel.init();
    TiendaModel.init();
    PedidoModel.init();
};
