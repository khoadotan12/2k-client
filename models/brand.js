const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BrandSchema = new Schema({
    name: String,
});

exports.query = async (id) => {
    const brandModel = mongoose.model('brands', BrandSchema);
    try {
        const model = await brandModel.findById(id);
        return model;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}