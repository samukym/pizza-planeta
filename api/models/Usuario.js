module.exports = {
  schema: {
    direcciones: [{
      nombre: String,
      calle: String,
      distrito: String,
      ciudad: String,
      latitud: Number,
      longitud: Number
    }],
    telefono: String,
    nombre: String,
    email: String,
    contrasenaHash: String,
    dni: Number
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
