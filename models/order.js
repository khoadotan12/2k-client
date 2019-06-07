const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const OrderSchema = new Schema({
    userID: ObjectId,
    create: Date,
    done: Date,
    status: Number,
    address: String,
    ward: String,
    district: String,
    items: {
        type: [{
            productID: ObjectId,
            count: Number,
        }]
    },
    price: Number
});
const orderModel = mongoose.model('orders', OrderSchema);
const userModel = require('./user');

exports.add = (order, callback) => {
    const newOrder = new orderModel(order);
    return newOrder.save(e => {
        return callback(e);
    })
};

exports.list = async (userID) => {
    try {
        const orders = await orderModel.find({ userID });
        const result = orders.map(order => {
            const dateCreated = new Date(order._doc.create);
            order._doc.create = dateCreated.toLocaleString('en-US');
            if (order._doc.done) {
                const dateDone = new Date(order._doc.done);
                order._doc.done = dateDone.toLocaleString('en-US');
            }
            return order._doc;
        });
        return result;
    }
    catch (e) {
        return null;
    }
};

exports.getID = async (id) => {
    try {
        return await orderModel.findById(id);
    } catch (e) {
        return null;
    }
};

exports.edit = async (id, data) => {
    try {
        return await orderModel.findByIdAndUpdate(id, data);
    } catch (e) {
        return null;
    }
};

exports.count = async () => {
    try {
        const count = await orderModel.find().count();
        return count;
    }
    catch (e) {
        return null;
    }
};