var mongoose = require('mongoose');

module.exports.init = function() {
  var schema = new mongoose.Schema({
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
  });

  var Pizza = mongoose.model('Pizza', schema);
};
