var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
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
