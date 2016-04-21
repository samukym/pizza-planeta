var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  var tipo = user.getTipo(function(err, tipo) {
    done(null, tipo + '|' + user._id);
  });
});

passport.deserializeUser(function(str, done) {
  var r = str.split('|'),
    tipo = r[0],
    id = r[1];
  switch (tipo) {
    case 0:
      Usuario.findById(id, function(err, user) {
        done(err, user);
      });
      break;
    case 1:
      Motorizado.findById(id, function(err, user) {
        done(err, user);
      });
      break;
    case 2:
      Tienda.findById(id, function(err, user) {
        done(err, user);
      });
      break;
  }
});

passport.use('usuario-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    Usuario.findByEmail(email, function(err, usuario) {
      if (err) {
        return done(err);
      }
      if (!usuario) {
        return done(null, false, {
          message: 'Incorrect'
        });
      }
      usuario.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, usuario, {
            message: 'Logged In'
          });
        }
        return done(null, false, {
          message: 'Invalid password'
        });
      });
    });
  }));

passport.use('motorizado-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    Motorizado.findByEmail(email, function(err, motorizado) {
      if (err) {
        return done(err);
      }
      if (!motorizado) {
        return done(null, false, {
          message: 'Incorrect'
        });
      }
      motorizado.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user, {
            message: 'Logged In'
          });
        }
        return done(null, false, {
          message: 'Invalid password'
        });
      });
    });
  }));

passport.use('tienda-local', new LocalStrategy({
    usernameField: 'idTienda',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(tiendaId, password, done) {
    Tienda.findById(tiendaId, function(err, tienda) {
      if (err) {
        return done(err);
      }
      if (!tienda) {
        return done(null, false, {
          message: 'Incorrect'
        });
      }
      tienda.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user, {
            message: 'Logged In'
          });
        }
        return done(null, false, {
          message: 'Invalid password'
        });
      });
    });
  }));
