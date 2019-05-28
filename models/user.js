const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: String,
    password: String,
    email: String,
    phone: String,
    address: String,
    ward: String,
    district: String,
});
const userModel = mongoose.model('users', UserSchema);

exports.add = (user, callback) => {
    const newUser = new userModel(user);
    return newUser.save(e => {
        return callback(e);
    })
};

exports.list = async () => {
    try {
        const users = await userModel.find();
        return users;
    }
    catch (e) {
        return null;
    }
};

exports.delete = async (id) => {
    try {
        return await userModel.findByIdAndRemove(id);
    } catch (e) {
        return null;
    }
};

exports.getID = async (id) => {
    try {
        return await userModel.findById(id);
    } catch (e) {
        return null;
    }
};

exports.getEmail = async (email) => {
    try {
        return await userModel.findOne({ email });
    } catch (e) {
        return null;
    }
}

exports.edit = async (id, data) => {
    try {
        return await userModel.findByIdAndUpdate(id, data);
    } catch (e) {
        return null;
    }
};