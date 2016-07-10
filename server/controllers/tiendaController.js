var jwt = require('jsonwebtoken'),
  Tienda = require('mongoose').model('Tienda'),
  app = require('../../server');

module.exports = {
  // login: (id, password) / (Tienda, tokenTienda)
  login: function(req, res) {
    Tienda.findById(req.body.id, function(err, tienda) {
      if (err) {
        console.log('error en findById: ', err);
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
        return;
      }
      if (!tienda) {
        console.log('Incorrect');
        res.send({
          error: true,
          message: 'Tienda no encontrada'
        });
        return;
      }
      tienda.comparePassword(req.body.password, function(err, isMatch) {
        console.log('comparePassword: ', isMatch);
        if (!isMatch) {
          // Si es correcta generamos el token
          var token = jwt.sign(tienda, app.get('superSecret'), {
            expiresIn: 86400, // tiempo de expiración
            algorithms: ['RS256']
          });
          req.session.token = token;
          console.log('LoggedIn');
          //socket login
          return res.json({
            success: true,
            message: 'Sesión iniciada (:',
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
  },
  crearTiendas: function(req, res) {
    var tienda1 = new Tienda({
      nombre: "Javier Prado",
      password: "tienda1",
      telefono: "123-4567",
      direccion: {
        calle: "Av. Javier Prado Este 5634",
        distrito: "La Molina",
        ciudad: "Lima",
        latitud: -12.073041,
        longitud: -76.959692
      }
    });
    var tienda2 = new Tienda({
      nombre: "San Isidro",
      password: "tienda2",
      telefono: "123-4567",
      direccion: {
        calle: "Av. Petit Thouars 2530",
        distrito: "San Isidro",
        ciudad: "Lima",
        latitud: -12.089273,
        longitud: -77.032741
      }
    });
    var tienda3 = new Tienda({
      nombre: "San Miguel",
      password: "tienda3",
      telefono: "363-4526",
      direccion: {
        calle: "Av. La Marina 1700",
        distrito: "La Molina",
        ciudad: "Lima",
        latitud: -12.078389,
        longitud: -77.079995
      }
    });

    Tienda.create(tienda1, tienda2, tienda3,
      function(err, tienda1, tienda2, tienda3) {
        if (err) {
          res.send({
            error: true,
            message: 'Oops! Ocurrió un error'
          });
        }
        console.log('Tiendas insertada', tienda1, tienda2, tienda3);
        return res.json({
          tienda1: tienda1,
          tienda2: tienda2,
          tienda3: tienda3
        });
      });
  }

};
