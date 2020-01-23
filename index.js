import Dashboard from "./app/Dashboard";
import Profile from "./app/Profile";
import MongoDBClient from "./app/db/MongoDBClient";
import Group from "./app/Group";
import auth from "./app/config/auth";
import mongoDbSession from 'connect-mongodb-session';
import session from 'express-session';
import cors from 'cors';
import csrf from 'csurf';
import passport from 'passport';
import {APP_SECRET} from './app/config/appConfig.js';


let express = require('express');        // call express
let app = express();                 // define our app using express
let bodyParser = require('body-parser');

const headerMiddleware = (req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
};

const createMongoDB = () => {
    const MongoDBStore = mongoDbSession(session);
    return new MongoDBStore({uri: "mongodb://localhost:27017/walkathon", collection: 'sessions'});
};

const appSession = session({
    secret: APP_SECRET,
    store: createMongoDB(),
    resave: false,
    saveUninitialized: false,
    cookie: {},
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(headerMiddleware);
app.use(appSession);
app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080;        // set our port

const startAuthentication = auth.authenticate('saml', {failureRedirect: '/api', failureFlash: true});
app.get('/api/login', startAuthentication, (req, res) => res.redirect('/api/dashboard'));
app.post('/api/login/callback', startAuthentication, (req, res) => res.redirect('/api'+req.body.RelayState));

const csrfProtection = csrf();
const corsOptions = {origin: true};


// ROUTES FOR OUR API
// =============================================================================
let router = express.Router();              // get an instance of the express Router
let db = new MongoDBClient();
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/dashboard', async (req, res)  => res.status(200).json(await new Dashboard(db).get(req.user.email)));
router.get('/profile', async (req, res)  => res.status(200).json(await new Profile(db).get(req.user.email)));
router.get('/groups', async (req, res)  => res.status(200).json({"groups" : await new Group(db).getAll()}));
router.get('/group/:groupId', async (req, res)  => res.status(200).json(await new Group(db).get(req.params.groupId)));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', auth.protected, csrfProtection, cors(corsOptions), router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
