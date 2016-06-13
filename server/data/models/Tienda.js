var mongoose = require('mongoose'),
passwordHash = require('password-hash'),
Google = require('../../services/googleService');

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
      return 1;
    },
    getTiendaCercana: function( lat, lng, cb, err){
      function distance(lat1, lon1, lat2, lon2) {
          var p = 0.017453292519943295; // Math.PI / 180
          var c = Math.cos;
          var a = 0.5 - c((lat2 - lat1) * p) / 2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p)) / 2;

          return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        }
        var dist = 0;
        var minDist = 99999999;
        var tienda = null;
        this.find({}, function(err, tiendas){
          tiendas.forEach(function (tiendaIter){
            dist = distance(tiendaIter.direccion.latitud, tiendaIter.direccion.longitud, lat, lng);
            if (dist < minDist) {
              minDist = dist;
              tienda = tiendaIter;
            }
          });
          cb(err, tienda);
        });
      }   
    });

      var Tienda = mongoose.model('Tienda', tiendaSchema);
    };
