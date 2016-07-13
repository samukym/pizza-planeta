var jwt = require('jsonwebtoken'),
  Usuario = require('mongoose').model('Usuario'),
  Motorizado = require('mongoose').model('Motorizado'),
  Tienda = require('mongoose').model('Tienda'),
  app = require('../../server');

module.exports = {
  validTokenUsuario: function(token, cb) {
    // console.log('token',token);
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          cb(true, null);
        }
        Usuario.findByToken(token, function(err, usuario) {
          if (!usuario) {
            cb(true, null);
          }
          cb(false, usuario);
        });
      });
    } else {
      cb(true, null);
    }
  },
  validTokenMotorizado: function(token, cb) {
    // console.log('token',token);
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          cb(true, null);
        }
        Motorizado.findByToken(token, function(err, motorizado) {
          if (!motorizado) {
            cb(true, null);
          }
          cb(false, motorizado);
        });
      });
    } else {
      cb(true, null);
    }
  },
  validTokenTienda: function(token, cb) {
    // console.log('token',token);
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          cb(true, null);
        }
        Tienda.findByToken(token, function(err, tienda) {
          if (!tienda) {
            cb(true, null);
          }
          cb(false, tienda);
        });
      });
    } else {
      cb(true, null);
    }
  }
};
