const mongoose = require('mongoose');

//Event schema
const eventSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    locations: {
        type: Array,
        required: false
    },
    events: {
        type: Array,
        required: false
    }
});

const User = module.exports = mongoose.model('users', eventSchema);

module.exports.addUser = (callback) => {
    ID = require('./id');
    var uid = ID.getId(8);
    var user = {};
    user['id'] = uid['id'];
    User.create(user, callback);
};

module.exports.addLocation = (userId, locationId, options, callback) => {
    var query = {id : userId};
    var update = {
        "$push": {
            "locations" : {
                "id" : locationId
            }
        }
    };
    User.findOneAndUpdate(query, update, options, callback);
};

module.exports.addEvent = (userId, eventId, options, callback) => {
    var query = {id : userId};
    var update = {
        "$push": {
            "events" : {
                "id" : eventId
            }
        }
    };
    User.findOneAndUpdate(query, update, options, callback);
};

module.exports.getUser = (userId, callback) => {
    var query = {id : userId};
    User.findOne(query, callback);
};