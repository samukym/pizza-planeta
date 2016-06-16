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
      },
      ingredientes: [{
        nombre: String,
        codigo: Number
      }] 
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
    estado: {
      type: String,
      enum: ['Sin confirmar', 'Confirmado', 'Preparando', 'En el horno', 'En camino', 'Entregado', 'Cancelado']
    },
    coEst: {
      type: Number,
      enum: [0, 10, 11, 12, 13, 20, 30]
    },
    ruta: {
      tiempo: Number,
      distancia: Number,
      points: String
    }
  });

  var Pedido = mongoose.model('Pedido', pedidoSchema);
};
