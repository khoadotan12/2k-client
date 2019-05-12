const mongoose = require('mongoose');
const config = require('./config');

exports.connectDB = () => {

    mongoose.connect(config.cloud, { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => console.log('Connect database successful'));
    return db;
}