const mongoose = require('mongoose');
const { brandsSchemaName } = require('../global');

const Schema = mongoose.Schema;
const BrandSchema = new Schema({
    name: String,
    count: Number,
    sold: Number,
    image: String,
    revenue: Number,
});

const brandModel = mongoose.model(brandsSchemaName, BrandSchema);

exports.queryByName = async (name) => {
    try {
        const model = await brandModel.findOne({ name });
        return model;
    }
    catch (e) {
        return null;
    }
}

exports.query = async (id) => {
    try {
        const model = await brandModel.findById(id);
        return model._doc;
    }
    catch (e) {
        return null;
    }
}

exports.list = async () => {
    try {
        const model = await brandModel.find();
        return model;
    }
    catch (e) {
        return null;
    }
}

exports.getTopList = async () => {
    try {
        const model = await brandModel.find().sort({ sold: -1 }).limit(3);
        return model;
    }
    catch (e) {
        return null;
    }
}

exports.setSoldAndRevenue = async (id, sold, price) => {
    try {
        const brand = await brandModel.findById(id);
        if (brand) {
            const newSold = brand.sold ? (brand.sold + sold) : sold;
            const newRevenue = brand.revenue ? (brand.revenue + sold * price) : sold * price;
            return await brandModel.findByIdAndUpdate(id, { sold: newSold, revenue: newRevenue });
        }
        else
            return null;

    } catch (e) {
        return null;
    }
};