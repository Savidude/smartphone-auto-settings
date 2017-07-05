const mongoose = require('mongoose');

//Event schema
const eventSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Location = module.exports = mongoose.model('locations', eventSchema);

module.exports.addLocation = (location, callback) => {
    console.log(JSON.stringify(location, null, 2));
    ID = require('./id');
    var locationId = ID.getId(16);
    location['id'] = locationId['id'];
    Location.create(location, callback);
};