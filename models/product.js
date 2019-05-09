const mongoose = require('mongoose');
const brandModel = require('./brand');


const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ProductSchema = new Schema({
    brand: { type: ObjectId, required: true },
    name: String,
    price: Number,
    image: String,
    color: [String],
    info: {
        RAM: Number,
        CPU: String,
        ROM: Number,
        OS: String,
        Screen: Number,
        sim: Number,
        frontCamera: String,
        backCamera: String,
    }
});

exports.info = async (id) => {
    const productModel = mongoose.model('products', ProductSchema);
    try {
        const model = await productModel.findById(id);
        const brand = await brandModel.query(model.brand);
        model._doc.brand = brand ? brand.name : 'Hãng khác'
        console.log(brand);
        return model;
    } catch (e) {
        console.log(e);
        return null;
    }
};