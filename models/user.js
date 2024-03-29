const mongoose = require('mongoose');
const { usersSchemaName } = require('../global');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: String,
    password: String,
    email: String,
    phone: String,
    address: String,
    ward: String,
    district: String,
    active: Boolean,
});
const userModel = mongoose.model(usersSchemaName, UserSchema);

exports.add = (user) => {
    const newUser = new userModel(user);
    return newUser.save();
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

exports.updatePassword = async (id, newPassword) => {
    try {
        return await userModel.findByIdAndUpdate(id, { password: newPassword });
    } catch (e) {
        return null;
    }
};

exports.active = async (id) => {
    try {
        return await userModel.findByIdAndUpdate(id, { active: true });
    } catch (e) {
        return null;
    }
};