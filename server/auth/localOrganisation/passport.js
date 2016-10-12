import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(Organisation, email, password, done) {
  Organisation.findOne({
    email: email.toLowerCase()
  }).exec()
    .then(org => {
      if(!org) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      org.authenticate(password, function(authError, authenticated) {
        if(authError) {
          return done(authError);
        }
        if(!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, org);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(Organisation/*, config*/) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthenticate(Organisation, email, password, done);
  }));
}
