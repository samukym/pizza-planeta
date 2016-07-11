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
          var token = jwt.sign(usuario._id, app.get('superSecret'), {
            expiresIn: 86400, // tiempo de expiración
            algorithms: ['RS256']
          });
          usuario.tokens.push({
            value: token,
            date: new Date()
          });

          usuario.save(function(err, usuario) {
            if (err) {
              res.send({
                error: true,
                message: 'Oops! Ocurrió un error'
              });
              return;
            }
            console.log('LoggedIn');
            console.log('session', req.session);
            req.session.user = usuario;
            return res.json({
              usuario: usuario,
              token: token
            });
          });
        } else {
          res.send({
            error: true,
            message: 'La contraseña no es correcta'
          });
        }
      });
    });
  },
  //funciona
  logout: function(req, res) {
    req.user.tokens = [];
    req.user.save(function(err, usuario) {
      if (err) {
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      req.session.destroy(function(err) {
        console.log(req.session);
        res.send('logout successful');
      });
    });
  },
  //crearUsuario: (email, password, nombre, dni, telefono) / (usuario, tokenUsuario)
  //funciona
  crearUsuario: function(req, res) {
    Usuario.findOne({
      email: req.body.email
    }, function(error, usuario) {
      if (error) {
        console.log("error buscando usuario para crear");
        return;
      }
      if (usuario) {
        res.send({
          error: true,
          message: 'El usuario ' + usuario.email + ' ya existe'
        });
        return;
      }
      var newUsuario = new Usuario({
        email: req.body.email,
        password: req.body.password,
        nombre: req.body.nombre,
        dni: req.body.dni,
        telefono: req.body.telefono,
        tokens: []
      });

      var token = jwt.sign(newUsuario._id, app.get('superSecret'), {
        expiresIn: 86400, // tiempo de expiración, checar documentacion
        algorithms: ['RS256']
      });
      newUsuario.tokens.push({
        value: token,
        date: new Date()
      });

      newUsuario.save(function(err, usuario) {
        if (err) {
          res.send({
            error: true,
            message: 'Oops! Ocurrió un error'
          });
          return;
        }
        req.session.user = newUsuario;
        console.log('Usuario insertado', newUsuario);
        return res.json({
          usuario: newUsuario,
          token: token
        });
      });
    });


  },

  //agregarDireccion: (nombre, calle, distrito, ciudad, latitud, longitud) / (resp)
  //funciona
  agregarDireccion: function(req, res) {
    Usuario.update({
      _id: req.session.user._id
    }, {
      $push: {
        direcciones: {
          nombre: req.body.nombre,
          calle: req.body.calle,
          distrito: req.body.distrito,
          ciudad: req.body.ciudad,
          latitud: req.body.latitud,
          longitud: req.body.longitud
        }
      }
    }, function(err, resp) {
      if (err) {
        console.error("error insertando direccion");
        return;
      }
      if (!resp) {
        console.error("Usuario " + req.session.user._id + "no exste");
        return;
      }
      console.log(resp);
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
      console.log('Hay %d usuarios:', usuarios.length, usuarios);
      return res.json(usuarios);
    });
  }
};
