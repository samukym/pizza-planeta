var mongoose = require('mongoose');

module.exports = {
  schema: {
    pizzas: [{
      detalle: String,
      nombre: String,
      cantidad: Number,
      comentario: String,
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
      placa: String,
      latitud: Number,
      longitud: Number
    }
  },

  /**
   * constructSchema()
   *
   * Note that this function must be synchronous!
   *
   * @param  {Dictionary} schemaDefinedAbove  [the raw schema defined above, or `{}` if no schema was provided]
   * @param  {SailsApp} sails                 [just in case you have globals disabled, this way you always have access to `sails`]
   * @return {MongooseSchema}
   */
  constructSchema: function(schemaDefinedAbove, sails) {
    // e.g. we might want to pass in a second argument to the schema constructor
    var newSchema = new sails.mongoose.Schema(schemaDefinedAbove, {
      autoIndex: false
    });

    // Regardless, you must return the instantiated Schema instance.
    return newSchema;
  }
};
