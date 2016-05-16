var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        phrase: 'estefany',
        rootPath: rootPath,
        db: 'mongodb://admin:admin@ds021711.mlab.com:21711/pizzaplaneta'/*'mongodb://localhost/pizzaplaneta'*/,
        port: process.env.PORT || 9001
    }
};
