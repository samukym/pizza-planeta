var jwt = require('jsonwebtoken'),
Usuario = require('mongoose').model('Usuario'),
Motorizado = require('mongoose').model('Motorizado'),
Tienda = require('mongoose').model('Tienda'),
Pizza = require('mongoose').model('Pizza'),
app = require('../../server'),
usuariolanata = require('../controllers/usuarioController');

module.exports = {
  validTokenUsuario: function(req, res, next) {
    // obtener token por post
    var token = req.body.token;

    // console.log('token',token);
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          res.send({
          error: true,
          message: 'Token no valido o no existe'
        });
          return;
        }
          if (req.session.token === token || usuariolanata.curToken() == token) {
            if (decoded._doc.tipo === Usuario.getTipo()) {
              req.session.user = decoded._doc;
              next();
            } else {
              res.send({
                error: true,
                message: 'No tiene permiso para realizar esta acción'
              });
              return;
            }
          } else {
            res.send({
              error: true,
              message: 'Token no valido o no existe'
            });
            return;
          }
        });
    } else {
      res.send({
        error: true,
        message: 'Token no valido o no existe'
      });
    }
  },
  validTokenMotorizado: function(req, res, next) {
    console.log('validTokenMotorizado');
    var token = req.body.token;
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) res.send({
          error: true,
          message: 'Token no valido o no existe'
        });
          console.log('session', req.session);
          console.log('decoded', decoded._doc);
          if (req.session.token === token) {
            if (decoded._doc.tipo === Motorizado.getTipo()) {
              req.session.user = decoded._doc;
              next();
            } else {
              res.send({
                error: true,
                message: 'No tiene permiso para realizar esta acción'
              });
              return;
            }
          } else {
            res.send({
              error: true,
              message: 'Token no valido o no existe'
            });
            return;
          }
        });
    } else {
      res.send({
        error: true,
        message: 'Token no valido o no existe'
      });
    }
  },
  validTokenTienda: function(req, res, next) {
    console.log('validTokenTienda');
    var token = req.body.token;
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) res.send({
          error: true,
          message: 'Token no valido o no existe'
        });
          console.log('session', req.session);
          console.log('decoded', decoded._doc);
          if (req.session.token === token) {
            if (decoded._doc.tipo === Tienda.getTipo()) {
              req.session.user = decoded._doc;
              next();
            } else {
              return res.send({
                error: true,
                message: 'No tiene permiso para realizar esta acción'
              });

            }
          } else {
            res.send({
              error: true,
              message: 'Token no valido o no existe'
            });
            return;
          }
        });
    } else {
      res.send({
        error: true,
        message: 'Token no valido o no existe'
      });
    }
  },
  findPizza: function(req, res, next) {
    Pizza.findOne({_id: req.body.idPizza}, function(err, pizza) {
      if (err) {
        res.send({error: true, message: 'error buscando la pizza'});
        return;
      }
      if(!pizza){
        res.send({error: true, message: 'Esta pizza no existe'});
        return;
      }
      var tamano = {};
      for (var i in pizza.tamanos) {
        if (pizza.tamanos[i].codigo === req.body.codTamano) {
          tamano = pizza.tamanos[i];
        }
      }
      var nuevaPizza = {
        nombre: pizza.nombre,
        detalle: pizza.detalle,
        comentario: req.body.comentario,
        cantidad: req.body.cantidad,
        tamano: tamano,
        ingredientes: pizza.ingredientes
      };
      req.nuevaPizza = nuevaPizza;
      next();
    });
  }
};
