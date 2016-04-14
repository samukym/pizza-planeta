
module.exports = {
  schema: {
    nombre: String,
    detalle: String,
    tamanos: [{
      precio: Number,
      nombre: String,
      kcal: Number,
      codigo: {
        type: String,
        enum: ['p', 'm', 'g', 'f']
      }
    }]
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
  constructSchema: function (schemaDefinedAbove, sails) {
    // e.g. we might want to pass in a second argument to the schema constructor
    var newSchema = new sails.mongoose.Schema(schemaDefinedAbove, { autoIndex: false });

    // Or we might want to define an instance method:
    newSchema.method('meow', function () {
      console.log('meeeeeoooooooooooow');
    });

    // Or a static ("class") method:
    newSchema.static('findPizza', function (name, callback) {
      return this.find({ nombre: name }, callback);
    });

    // Regardless, you must return the instantiated Schema instance.
    return newSchema;
  }
};
