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

const Location = module.exports = mongoose.model('Location', eventSchema);

module.exports.addLocation = (location, callback) => {
    var token = require('rand-token').uid;
    var locationId = token(16);
    location['id'] = locationId;
    Location.create(location, callback);
};