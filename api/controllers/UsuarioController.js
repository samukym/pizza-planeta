var passport = require('passport');

module.exports = {

//funciona
  login: function(req, res, next) {
    passport.authenticate('usuario-local', function(err, usuario, info) {
      if (err) {
        return next(err);
      }
      if (!usuario) {
        return res.send({
          message: 'login failed'
        });
      }
      req.logIn(usuario, function(err) {
        if (err) {
          return next(err);
        }
        //generar token
        var token = generateToken();
        req.session.token = token;
        return res.json({
          usuario: usuario,
          token: token
        });
      });
    })(req, res, next);
  },

//KHE
  logout: function(req, res) {
    req.logout();
    res.send('logout successful');
  },

//funciona
  crearUsuario: function(req, res) {
    var usuario = new Usuario({
      telefono: req.param('telefono'),
      nombre: req.param('nombre'),
      email: req.param('email'),
      password: req.param('password'),
      dni: req.param('dni'),
      tipo: 0
    });
    usuario.save(function(err, usuario) {
      if (err) {
        return res.negotiate(err);
      }
      var token = generateToken();
      req.session.token = token;
      sails.log('Usuario insertado', usuario);
      return res.json({
        usuario: usuario,
        token: token
      });
    });
  },

//KHE
  agregarDireccion: function(req, res) {
    var valid = validToken(req.session, req.param('tokenUsuario'));
    console.log('validToken', valid);

    req.user.direcciones.push({
      idDireccion: req.param('latitud') + req.param('longitud'),
      nombre: req.param('nombre'),
      calle: req.param('calle'),
      distrito: req.param('distrito'),
      ciudad: req.param('ciudad'),
      latitud: req.param('latitud'),
      longitud: req.param('longitud')
    });

    req.user.save(function(err, usuario) {
      if (err) {
        return res.negotiate(err);
      }
      return res.json({
        usuario: usuario,
        token: token
      });
    });

  },

//KHE
  findUsuario: function(req, res) {
    console.log('findUsuario');
    var valid = validToken(req.session, req.param('tokenUsuario'));

    console.log('validToken', valid);

    return res.json(req.user);
  },

//funciona
  find: function(req, res) {
      Usuario.find().exec(function(err, usuarios) {
        if (err) {
          return res.negotiate(err);
        }
        sails.log('Hay %d usuarios:', usuarios.length, usuarios);
        return res.json(usuarios);
      });
    }

};
