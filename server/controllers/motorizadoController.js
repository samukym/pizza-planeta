var jwt = require('jsonwebtoken'),
  Motorizado = require('mongoose').model('Motorizado'),
  app = require('../../server');

module.exports = {
  //login: (email, password) / (motorizado, tokenMotorizado)
  login: function(req, res) {
    Motorizado.findByEmail(req.body.email, function(err, motorizado) {
      if (err) {
        console.log('error en findByEmail: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
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
  //funciona
  logout: function(req, res) {
    req.session.destroy(function(err) {
      console.log(req.session);
      res.send('logout successful');
    });
  },
  // findMotorizado: (tokenMotorizado) / (Motorizado)
  findMotorizado: function(req, res) {
    return res.json(req.session.user);
  }
};
