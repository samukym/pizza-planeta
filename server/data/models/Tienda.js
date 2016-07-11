var mongoose = require('mongoose'),
passwordHash = require('password-hash'),
Distance = require('../../utils/routesAndDistance');

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
        var dist = 0;
        var minDist = 99999999;
        var tienda = null;
        this.find({}, function(err, tiendas){
          tiendas.forEach(function (tiendaIter){
            dist = Distance.getDistance(tiendaIter.direccion.latitud, tiendaIter.direccion.longitud, lat, lng);
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
