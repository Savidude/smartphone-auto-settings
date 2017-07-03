const mongoose = require('mongoose');

//Event schema
const eventSchema = mongoose.Schema({
   uid: {
        type: String,
        required: true
   },
    event: {
        type: Object,
        required: true
    }
});

const Event = module.exports = mongoose.model('Event', eventSchema);

module.exports.addEvent = (event, callback) => {
    Event.create(event, callback);
}