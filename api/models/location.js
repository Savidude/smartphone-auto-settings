const mongoose = require('mongoose');
var fs = require('fs');
var isgd = require('isgd');

//Event schema
const eventSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const Location = module.exports = mongoose.model('locations', eventSchema);

module.exports.addLocation = (location, callback) => {
    ID = require('./id');
    //Setting an ID for the location
    var locationId = ID.getId(16);
    location['id'] = locationId['id'];

    //Setting a URL for the location
    var contents = fs.readFileSync("config/conf.json");
    var jsonContent = JSON.parse(contents);
    var frontEndUrl = jsonContent.frontEndUrl;
    var locationUrl = frontEndUrl + '/location.html?id=' + locationId['id'];

    if (jsonContent.hosting === 'remote') {
        isgd.shorten(locationUrl, function (res) {
            location['url'] = res;
            Location.create(location, callback);
            console.log('location created!')
        });
    } else if (jsonContent.hosting === 'local') {
        location['url'] = locationUrl;
        Location.create(location, callback);
    }
};

module.exports.getLocation = (locationId, callback) => {
    var query = {id : locationId};
    Location.findOne(query, callback);
};