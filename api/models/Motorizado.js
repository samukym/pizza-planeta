var mongoose = require('mongoose');

module.exports = {
  schema: {
    tiendaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda'
    },
    nombre: String,
    telefono: String,
    email: String,
    contrasenaHash: String,
    dni: Number,
    placa: String
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
