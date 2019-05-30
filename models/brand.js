const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BrandSchema = new Schema({
    name: String,
    count: Number,
    sold: Number,
    image: String,
});
const { brandsSchemaName } = require('../global');
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