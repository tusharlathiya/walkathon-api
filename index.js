import Dashboard from "./app/Dashboard";
import MongoDBClient from "./app/db/MongoDBClient";

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

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
