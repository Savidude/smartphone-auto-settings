module.exports.getToken = (limit) => {
    var randtoken = require('rand-token');
    var token = randtoken.generate(16);

    var tokenData = {};
    tokenData['token'] = token
    return tokenData;
}