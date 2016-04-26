var jwt = require('jsonwebtoken'),
  Tienda = require('mongoose').model('Tienda'),
  app = require('../../server');

module.exports = {
  // login: (idTienda, password) / (Tienda, tokenTienda)
  login: function(req, res) {
    Tienda.findById(req.body.idTienda, function(err, tienda) {
      if (err) {
        console.log('error en findById: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
      }
      if (!tienda) {
        console.log('Incorrect');
        res.send({
          error: true,
          message: 'Tienda no encontrada'
        });
      }
      tienda.comparePassword(req.body.password, function(err, isMatch) {
        console.log('comparePassword: ', isMatch);
        if (isMatch) {
          // Si es correcta generamos el token
          var token = jwt.sign(tienda, app.get('superSecret'), {
            expiresIn: 86400, // tiempo de expiración
            algorithms: ['RS256']
          });
          req.session.token = token;
          console.log('LoggedIn');
          console.log('session', req.session);
          return res.json({
            tienda: tienda,
            token: token
          });
        }
        res.send({
          error: true,
          message: 'La contraseña no es correcta'
        });
      });
    });
  },

  logout: function(req, res) {
    req.session.destroy(function(err) {
      console.log(req.session);
      res.send('logout successful');
    });
  },
  // findTiendas: (lista de Tiendas)
  find: function(req, res) {
    Tienda.find().exec(function(err, tiendas) {
      if (err) {
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
      }
      console.log('Hay %d tiendas:', tiendas.length, tiendas);
      return res.json(tiendas);
    });
  },
  // findTienda: (idTienda) / (tienda)
  findTienda: function(req, res) {
    return res.json(req.session.user);
  }
};
