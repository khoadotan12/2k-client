const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BrandSchema = new Schema({
    name: String,
    count: Number,
    image: String,
});
const brandModel = mongoose.model('brands', BrandSchema);

exports.queryByName = async (name) => {
    try {
        const model = await brandModel.find({ name });
        return model;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

exports.query = async (id) => {
    try {
        const model = await brandModel.findById(id);
        return model._doc;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

exports.list = async () => {
    try {
        const model = await brandModel.find();
        model.forEach(item => {
            item._doc.name = item._doc.name.toLowerCase();
        })
        return model;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

exports.getTopList = async () => {
    try {
        const model = await brandModel.find().sort({ sold: -1 }).limit(3);
        return model;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}