var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        phrase: 'holi',
        rootPath: rootPath,
        db: 'mongodb://localhost/pizzaplaneta',
        port: process.env.PORT || 9001
    }
};
