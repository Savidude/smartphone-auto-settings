var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs');

app.use(cors())
app.use(bodyParser.json());

User = require('./models/user');
Event = require('./models/event');
Location = require('./models/location');

//Connect to Mongoose
var contents = fs.readFileSync("config/conf.json");
var jsonContent = JSON.parse(contents);
var mongoDBUrl= jsonContent.mongoDBUrl;
mongoose.connect(mongoDBUrl);
var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Please use /api/events or /api/locations');
});

/*
 ----------------------------User API------------------------------
 */
//Creating new user
app.get('/api/user', (req, res) => {
    User.addUser((err, user) => {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});

//Getting a specific user's set of locations
app.get('/api/user/:id/locations', (req, res) => {
    var userId = req.params.id;
    User.getUser(userId, (err, user) => {
        if (err) {
            throw err;
        }
        try {
            var locations = user['locations'];
            res.json(locations);
        } catch (err) {
            res.json(undefined); //TODO: send appropriate response
        }
    });
});

//Adding a new location to the user
app.post('/api/user/location', (req, res) => {
    var data = req.body;
    var userId = data.uid;
    var locationId = data.locationId;

    User.getUser(userId, (err, user) => {
        if (err) {
            throw err;
        }
        try {
            var locations = user['locations'];
            var visited = false;
            for (var i = 0; i < locations.length; i++) {
                if (locations[i]['id'] == locationId) {
                    visited = true;
                    break;
                }
            }
            if (!visited) {
                User.addLocation(userId, locationId, {}, (err, user) => {
                    if (err) {
                        throw err;
                    }
                    res.json(user);
                });
            }
        } catch (err) {
            console.log(err);
        }
    });
});

/*
 ----------------------------Event API------------------------------
 */
//Adding new event to the database
app.post('/api/event', (req, res) => {
    //Adding new event to the database
    var eventData = req.body;
    Event.addEvent(eventData, (err, event) => {
        if (err) {
            throw err;
        }

        //Adding the event to the user's set of events
        var userId = eventData['uid'];
        var eventId = event['id'];
        User.addEvent(userId, eventId, {}, (err, user) => {
            if (err) {
                throw err;
            }
            res.json(event);
        });
    });
});

//Getting user specific events based on location
app.get('/api/event/user/:uid/location/:lid', (req, res) => {
    var locationId = req.params.lid;
    var userId = req.params.uid;

    Event.getEvents(userId, locationId, (events) => {
        res.json(events)
    });
});


/*
----------------------------Location API------------------------------
 */
//Adding new location to the database
app.post('/api/location', (req, res) => {
    //Adding new location to the database
    var locationData = req.body;
    var location = locationData['location'];
    Location.addLocation(location, (err, location) => {
        if (err) {
            throw err;
        }

        //Adding the location to the user's set of locations
        var userId = locationData['user']['id'];
        var locationId = location['id'];
        User.addLocation(userId, locationId, {}, (err, user) => {
            if (err) {
                throw err;
            }
            res.json(location);
        });
    });
});

//Getting location data from the ID provided
app.get('/api/location/:id', (req, res) => {
    var locationId = req.params.id;
    Location.getLocation(locationId, (err, location) => {
        if (err) {
            throw err;
        }
        res.json(location);
    });
});

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});