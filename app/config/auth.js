import passport from 'passport';
import {Strategy as SamlStrategy} from 'passport-saml';
import {oktaConfig} from '../config/appConfig';

const userSession = [];
const findUserSession = email => userSession.find(u => u.email === email);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  const user = findUserSession(email);
  return user ? done(null, user) : done(null, null);
});

passport.protected = (req, res, next) => (req.isAuthenticated() ? next() : res.redirect('/api/login?RelayState='+req.path));

const onUserLogin = (profile, done) => {
  const {email, firstName, lastName} = profile;

  if (!email) {
    return done(new Error('No email found for user!'), null);
  }

  const loggedInUser = {
    firstName,
    lastName,
    email
  };

  if (!findUserSession(email)) {
    userSession.push(loggedInUser);
  }

  return done(null, loggedInUser);
};

passport.use(new SamlStrategy(oktaConfig, onUserLogin));

export default passport;
