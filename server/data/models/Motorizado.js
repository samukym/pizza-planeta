var mongoose = require('mongoose');
var passwordHash = require('password-hash');

module.exports.init = function() {
  var motorizadoSchema = new mongoose.Schema({
    tiendaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda'
    },
    username: String,
    nombre: String,
    telefono: String,
    email: String,
    hashed_password: String,
    dni: Number,
    placa: String,
    tipo: {
      type: Number,
      default: 2
    }
  });

  motorizadoSchema.virtual('password').set(function(password) {
      this._password = password;
      this.hashed_password = passwordHash.generate(password);
    })
    .get(function() {
      return this._password;
    });

  motorizadoSchema.method({
    comparePassword: function(candidatePassword, cb) {
      cb(null, passwordHash.verify(candidatePassword, this.hashed_password));
    }
  });

  motorizadoSchema.static({
    getTipo: function() {
      return 2;
    },
    findByUsername: function(username, callback) {
      return this.findOne({
        username: username
      }, callback);
    }
  });

  var Motorizado = mongoose.model('Motorizado', motorizadoSchema);
};
