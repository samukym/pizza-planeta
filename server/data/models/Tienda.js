var mongoose = require('mongoose'),
  passwordHash = require('password-hash'),
  getDistance = require('../../utils/distance');

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
      default: 1
    },
    tokens: [{
      value: String,
      fecha: Date
    }]
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
    },
    validateToken: function(checkToken, cb) {
      var existe = false;
      for (var i = 0; i < this.tokens.length; i++) {
        if (this.tokens[i].value == checkToken) {
          existe = true;
          break;
        }
      }
      cb(existe);
    }
  });

  tiendaSchema.static({
    getTipo: function() {
      return 1;
    },
    getTiendaCercana: function(lat, lng, cb) {
      var dist = 0;
      var minDist = 99999999;
      var tienda = null;
      this.find({}, function(err, tiendas) {
        tiendas.forEach(function(tiendaIter) {
          dist = getDistance(tiendaIter.direccion.latitud, tiendaIter.direccion.longitud, lat, lng);
          console.log(lat+lng);
          if (dist < minDist) {
            minDist = dist;
            tienda = tiendaIter;
          }
        });
        cb(err, tienda);
      });
    },
    findByToken: function(token, callback) {
      console.log("Tienda.findByToken",token);
      this.findOne({
        tokens: {
          $elemMatch: {
            value: token
          }
        }
      }, callback);
    }
  });

  var Tienda = mongoose.model('Tienda', tiendaSchema);
};
