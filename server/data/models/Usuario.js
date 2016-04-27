var mongoose = require('mongoose');
var passwordHash = require('password-hash');

module.exports.init = function() {
  var usuarioSchema = new mongoose.Schema({
    email: String,
    hashed_password: String,
    nombre: String,
    dni: Number,
    telefono: String,
    tipo: {
      type: Number,
      default: 0
    },
    direcciones: [{
      nombre: String,
      calle: String,
      distrito: String,
      ciudad: String,
      latitud: Number,
      longitud: Number
    }]
  });

  usuarioSchema.virtual('password').set(function(password) {
      this._password = password;
      this.hashed_password = passwordHash.generate(password);
    })
    .get(function() {
      return this._password;
    });

  usuarioSchema.method({
    comparePassword: function(candidatePassword, cb) {
      cb(null, passwordHash.verify(candidatePassword, this.hashed_password));
    }
  });

  usuarioSchema.static({
    getTipo: function() {
      return 0;
    },
    findByEmail: function(email, callback) {
      return this.findOne({
        email: email
      }, callback);
    }
  });

  var Usuario = mongoose.model('Usuario', usuarioSchema);
};
