var jwt = require('jsonwebtoken'),
  Motorizado = require('mongoose').model('Motorizado'),
  app = require('../../server');

module.exports = {
  //login: (username, password) / (motorizado, tokenMotorizado)
  login: function(req, res) {
    Motorizado.findByUsername(req.body.username, function(err, motorizado) {
      if (err) {
        console.log('error en findByUsername: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      console.log('username', req.body.username);
      console.log('motorizado', motorizado);
      if (!motorizado) {
        console.log('Incorrect');
        res.send({
          error: true,
          message: 'Motorizado no encontrado'
        });
        return;
      }
      motorizado.comparePassword(req.body.password, function(err, isMatch) {
        console.log('comparePassword: ', isMatch);
        if (isMatch) {
          // Si es correcta generamos el token
          var token = jwt.sign(motorizado, app.get('superSecret'), {
            expiresIn: 86400, // tiempo de expiración
            algorithms: ['RS256']
          });
          req.session.token = token;
          console.log('LoggedIn');
          console.log('session', req.session);
          return res.json({
            motorizado: motorizado,
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
  // logout: (tokenMotorizado)
  logout: function(req, res) {
    req.session.destroy(function(err) {
      console.log(req.session);
      res.send('logout successful');
    });
  },
  // findMotorizado: (tokenMotorizado) / (Motorizado)
  findMotorizado: function(req, res) {
    return res.json(req.session.user);
  },
  //crear motorizados
  crearMotorizados: function(req, res) {
    var moto1 = new Motorizado({
      tiendaId: "5720f3f8b12db7d80016326e",
      username: "phablutzel",
      nombre: "Pedro Hablútzel",
      telefono: "959-392-937",
      email: "phablutzel@pizzaplaneta.com",
      password: "moto1",
      dni: 74123698,
      placa: "AB-1234"
    });

    var moto2 = new Motorizado({
      tiendaId: "5720f3f8b12db7d80016326f",
      username: "srios",
      nombre: "Sandra Ríos",
      telefono: "965-052-033",
      email: "srios@pizzaplaneta.com",
      password: "moto2",
      dni: 69874125,
      placa: "XY-7526"
    });

    var moto3 = new Motorizado({
      tiendaId: "5720f3f8b12db7d800163270",
      username: "aespinoza",
      nombre: "Augusto Espinoza",
      telefono: "999-511-038",
      email: "aespinoza@pizzaplaneta.com",
      password: "moto3",
      dni: 69874125,
      placa: "AP-2222"
    });

    Motorizado.create(moto1, moto2, moto3,
      function(err, moto1, moto2, moto3) {
        if (err) {
          res.send({
            error: true,
            message: 'Oops! Ocurrió un error'
          });
          return;
        }
        console.log('Motorizados insertados', moto1, moto2, moto3);
        return res.json({
          moto1: moto1,
          moto2: moto2,
          moto3: moto3
        });
      });
  }
};
