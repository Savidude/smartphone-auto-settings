module.exports.getUid = (limit) => {
    var token = require('rand-token').uid;
    var uid = token(16);

    var data = {};
    data['uid'] = uid;
    return data;
}