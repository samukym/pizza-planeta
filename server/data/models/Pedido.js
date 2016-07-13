var mongoose = require('mongoose');

var pedidoEstados = {
  desc: ['Sin confirmar', 'Confirmado', 'Preparando', 'En el horno', 'Por salir', 'En camino', 'Llegando', 'Su pizza ha llegado', 'Entregado', 'Cancelado'],
  cods: [0, 10, 20, 21, 22, 50, 51, 52, 70, 90]
};

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
    usuario: {
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
    tienda: {
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
      enum: pedidoEstados.desc
    },
    coEst: {
      type: Number,
      enum: pedidoEstados.cods
    },
    ruta: {
      tiempo: Number,
      distancia: Number,
      points: String
    }
  });

  pedidoSchema.method({
    updateEstado: function(newEstado) {
      var index = -1;
      for (var i = 0; i < pedidoEstados.cods.length; i++) {
        if (pedidoEstados.cods[i] == newEstado) {
          index = i;
          break;
        }
      }
      this.coEst = pedidoEstados.cods[index];
      this.estado = pedidoEstados.desc[index];
    },
    nextEstado: function() {
      var index = -1;
      for (var i = 0; i < pedidoEstados.cods.length; i++) {
        if (pedidoEstados.cods[i] == this.coEst) {
          index = i;
          break;
        }
      }
      return pedidoEstados.cods[index+1];
    }
  });

  var Pedido = mongoose.model('Pedido', pedidoSchema);
};
