const mongoose = require('mongoose');

//Event schema
const eventSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    event: {
        type: Object,
        required: true
    }
});

const Event = module.exports = mongoose.model('events', eventSchema);

module.exports.addEvent = (event, callback) => {
    ID = require('./id');
    var eventId = ID.getId(24);
    event['id'] = eventId['id'];
    Event.create(event, callback);
};

module.exports.getEvents = (userId, locationId, callback) => {
    var query = {uid : userId};
    Event.find(query, (err, events) => {
        events.forEach(function (entry) {
            var eventsArray = [];
            var event = entry['event'];
            var location = event['location'];
            if (location == locationId) {
                eventsArray.push(event)
            }
            callback(eventsArray);
        });
    });
};