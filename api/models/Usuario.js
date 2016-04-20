module.exports = {
  schema: {
    direcciones: [{
      idDireccion: String,
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
    password: String,
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

    newSchema.pre('save', function(next) {
      var user = this;

      // only hash the password if it has been modified (or is new)
      if (!user.isModified('perfil_individual.password')) return next();

      var hashedPassword = passwordHash.generate(user.perfil_individual.password);

      user.perfil_individual.password = hashedPassword;
      next();
    });

    newSchema.method('comparePassword', function(candidatePassword, cb) {
      cb(null, passwordHash.verify(candidatePassword, this.perfil_individual.password));
    })

    newSchema.static('findByEmail', function (email, callback) {
      return this.find({ email: email }, callback);
    });

    // Regardless, you must return the instantiated Schema instance.
    return newSchema;
  }
};
