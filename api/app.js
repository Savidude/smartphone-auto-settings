var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs');

app.use(cors())

Uid = require('./models/uid');

//Connect to Mongoose
var contents = fs.readFileSync("config/conf.json");
var jsonContent = JSON.parse(contents);
var mongoDBUrl= jsonContent.mongoDBUrl;
mongoose.connect(mongoDBUrl);
var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Please use /api/events or /api/locations');
});

app.get('/api/uid', (req, res) => {
    var uid = Uid.getUid(1);
    res.json(uid);
});

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});