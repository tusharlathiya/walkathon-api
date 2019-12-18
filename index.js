import Dashboard from "./app/Dashboard";
import MongoDBClient from "./app/db/MongoDBClient";
import Group from "./app/Group";

let express = require('express');        // call express
let app = express();                 // define our app using express
let bodyParser = require('body-parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
let router = express.Router();              // get an instance of the express Router
let db = new MongoDBClient();
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', async (req, res)  => res.status(200).json(await new Dashboard(db).get()));
router.get('/groups', async (req, res)  => res.status(200).json({"groups" : await new Group(db).getAll()}));
router.get('/group/:groupId', async (req, res)  => res.status(200).json(await new Group(db).get(req.params.groupId)));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
