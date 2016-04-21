var mongoose = require('mongoose');
var passwordHash = require('password-hash');

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
    placa: String,
    tipo: Number
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
      var motorizado = this;

      // only hash the password if it has been modified (or is new)
      if (!motorizado.isModified('password')) return next();

      var hashedPassword = passwordHash.generate(user.password);

      motorizado.password = hashedPassword;
      next();
    });

    newSchema.method('comparePassword', function(candidatePassword, cb) {
      cb(null, passwordHash.verify(candidatePassword, this.password));
    });

    newSchema.method('getTipo', function(cb) {
      return cb(null, this.get('tipo'));
    });

    newSchema.static('findByEmail', function (email, callback) {
      return this.find({ email: email }, callback);
    });

    // Regardless, you must return the instantiated Schema instance.
    return newSchema;
  }
};
