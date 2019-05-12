const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BrandSchema = new Schema({
    name: String,
    count: Number,
});
const brandModel = mongoose.model('brands', BrandSchema);
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