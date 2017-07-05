module.exports.getId = (chars) => {
    var token = require('rand-token').uid;
    var id = token(chars);

    var data = {};
    data['id'] = id;
    return data;
}