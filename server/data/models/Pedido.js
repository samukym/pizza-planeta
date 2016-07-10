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
    datosUsuario: {
      nombre: String,
      telefono: String,
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
      enum: ['Sin confirmar', 'Confirmado', 'Preparando', 'En el horno', 'Por salir', 'En camino', 'Llegando', 'Su pizza ha llegado', 'Entregado', 'Cancelado']
    },
    coEst: {
      type: Number,
      enum: [0, 10, 20, 21, 22, 50, 51, 52, 70, 90]
    },
    ruta: {
      tiempo: Number,
      distancia: Number,
      points: String
    }
  });

  var Pedido = mongoose.model('Pedido', pedidoSchema);
};
