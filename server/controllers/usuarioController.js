var jwt = require('jsonwebtoken'),
  Usuario = require('mongoose').model('Usuario'),
  app = require('../../server');

module.exports = {
  //login: (email, password) / (usuario, tokenUsuario)
  //funciona
  login: function(req, res) {
    Usuario.findByEmail(req.body.email, function(err, usuario) {
      if (err) {
        console.log('error en findByEmail: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!usuario) {
        console.log('Incorrect');
        res.send({
          error: true,
          message: 'Usuario no encontrado'
        });
        return;
      }
      usuario.comparePassword(req.body.password, function(err, isMatch) {
        console.log('comparePassword: ', isMatch);
        if (isMatch) {
          // Si es correcta generamos el token
          var token = jwt.sign(usuario, app.get('superSecret'), {
            expiresIn: 86400, // tiempo de expiración
            algorithms: ['RS256']
          });
          req.session.token = token;
          console.log('LoggedIn');
          console.log('session', req.session);
          return res.json({
            usuario: usuario,
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
  //funciona
  logout: function(req, res) {
    req.session.destroy(function(err) {
      console.log(req.session);
      res.send('logout successful');
    });
  },
  //crearUsuario: (email, password, nombre, dni, telefono) / (usuario, tokenUsuario)
  //funciona
  crearUsuario: function(req, res) {
    var usuario = new Usuario({
      email: req.param('email'),
      password: req.param('password'),
      nombre: req.param('nombre'),
      dni: req.param('dni'),
      telefono: req.param('telefono')
    });
    usuario.save(function(err, usuario) {
      if (err) {
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
      }
      var token = jwt.sign(usuario, app.get('superSecret'), {
        expiresIn: 86400, // tiempo de expiración, checar documentacion
        algorithms: ['RS256']
      });
      req.session.token = token;
      console.log('Usuario insertado', usuario);
      return res.json({
        usuario: usuario,
        token: token
      });
    });
  },

  //agregarDireccion: (nombre, calle, distrito, ciudad, latitud, longitud) / (resp)
  //funciona
  agregarDireccion: function(req, res) {
    Usuario.update( {_id : req.session.user._id}, 
      {$push: {direcciones: { 
        nombre : req.body.nombre,         
        calle : req.body.calle,         
        distrito : req.body.distrito,         
        ciudad : req.body.ciudad,         
        latitud : req.body.latitud,         
        longitud : req.body.longitud }}
      }, function(err, resp){
        if(err){
          console.error("error insertando direccion");
          return;
        }
        return res.json({
          respuesta: resp
        });
      });
  },

  //funciona
  findUsuario: function(req, res) {
    return res.json(req.session.user);
  },

  //funciona
  find: function(req, res) {
    Usuario.find().exec(function(err, usuarios) {
      if (err) {
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
      }
      sails.log('Hay %d usuarios:', usuarios.length, usuarios);
      return res.json(usuarios);
    });
  }
};
