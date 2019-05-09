const mongoose = require('mongoose');
const brandModel = require('./brand');


const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ProductSchema = new Schema({
    brand: { type: ObjectId, required: true },
    name: String,
    price: Number,
    image: String,
    type: String,
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
const productModel = mongoose.model('products', ProductSchema);

exports.info = async (id) => {
    try {
        const model = await productModel.findById(id);
        const brand = await brandModel.query(model.brand);
        model._doc.brand = brand ? brand.name : 'Hãng khác'
        return model;
    } catch (e) {
        console.log(e);
        return null;
    }
};

exports.getList = async (page) => {
    try {
        const products = await productModel.find();
        pageProducts = products.slice((page - 1) * 10, page * 10);
        pageProducts.forEach(async (product) => {
            const brand = await brandModel.query(product.brand);
            product._doc.brand = brand ? brand.name : 'Hãng khác';
            return product;
        });
        return pageProducts;
    } catch (e) {
        console.log(e);
        return null;
    }
}