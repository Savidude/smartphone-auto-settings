var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs');

app.use(cors())

Token = require('./models/token');

//Connect to Mongoose
var contents = fs.readFileSync("config/conf.json");
var jsonContent = JSON.parse(contents);
var mongoDBUrl= jsonContent.mongoDBUrl;
mongoose.connect(mongoDBUrl);
var db = mongoose.connection;

app.get('/', (req, res) => {
    console.log('/');
    res.send('Please use /api/events or /api/locations');
});

app.get('/api/token', (req, res) => {
    var token = Token.getToken(1);
    res.json(token);
});

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});