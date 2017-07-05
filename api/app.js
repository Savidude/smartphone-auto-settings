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

app.get('/api/user', (req, res) => {
    // var uid = Uid.getUid(1);
    // res.json(uid);
    User.addUser((err, user) => {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});


app.post('/api/event', (req, res) => {
    var event = req.body;
    Event.addEvent(event, (err, event) => {
        if (err) {
            throw err;
        }
        res.json(event);
    });
});

app.post('/api/location', (req, res) => {
    var location = req.body;
    Location.addLocation(location, (err, location) => {
        if (err) {
            throw err;
        }
        res.json(location);
    });
});

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});