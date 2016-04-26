var mongoose = require('mongoose');
var passwordHash = require('password-hash');

module.exports.init = function() {
  var tiendaSchema = new mongoose.Schema({
    nombre: String,
    hashed_password: String,
    telefono: String,
    direccion: {
      calle: String,
      distrito: String,
      ciudad: String,
      latitud: Number,
      longitud: Number
    },
    tipo: {
      type: Number,
      default: 2
    }
  });

  tiendaSchema.virtual('password').set(function(password) {
      this._password = password;
      this.hashed_password = passwordHash.generate(password);
    })
    .get(function() {
      return this._password;
    });

  tiendaSchema.method({
    comparePassword: function(candidatePassword, cb) {
      cb(null, passwordHash.verify(candidatePassword, this.hashed_password));
    }
  });

  tiendaSchema.static({
    getTipo: function() {
      return 2;
    }
  });

  var Tienda = mongoose.model('Tienda', tiendaSchema);
};
