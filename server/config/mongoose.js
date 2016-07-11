var mongoose = require('mongoose');

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

    var  PizzaModel = require('../data/models/Pizza');
    PizzaModel.init();
    var  UsuarioModel = require('../data/models/Usuario');
    UsuarioModel.init();
    var  MotorizadoModel = require('../data/models/Motorizado');
    MotorizadoModel.init();
    var  PedidoModel = require('../data/models/Pedido');
    PedidoModel.init();
    var  TiendaModel = require('../data/models/Tienda');
    TiendaModel.init();
};
