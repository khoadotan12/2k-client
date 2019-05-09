var mongoose = require('mongoose');


exports.connectDB = () => {
    const PROD_URI = "mongodb://localhost:27017/mobileShop";

    mongoose.connect(PROD_URI, { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => console.log('Connect database successful'));
    return db;
}