var mongoose = require('mongoose');

module.exports.init = function() {
  var pedidoSchema = new mongoose.Schema({
    pizzas: [{
      nombre: String,
      detalle: String,
      comentario: String,
      cantidad: Number,
      tamano: {
        precio: Number,
        nombre: String,
        kcal: Number,
        codigo: String
      }
    }],
    precioSubtotal: Number,
    precioIgv: Number,
    precioTotal: Number,
    comentario: String,
    fecha: Date,
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    direccion: {
      nombre: String,
      calle: String,
      distrito: String,
      ciudad: String,
      latitud: Number,
      longitud: Number
    },
    tiendaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda'
    },
    motorizado: {
      nombre: String,
      telefono: String,
      email: String,
      dni: Number,
      placa: String
    },
    latitud: Number,
    longitud: Number,
    codReciboVisa: String,
    estado: String,
    coEst: Number
  });

  var Pedido = mongoose.model('Pedido', pedidoSchema);
};
