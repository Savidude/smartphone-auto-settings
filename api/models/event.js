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