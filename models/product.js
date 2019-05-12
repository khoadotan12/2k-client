const mongoose = require('mongoose');
const brandModel = require('./brand');
const { perPage } = require('../global');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ProductSchema = new Schema({
    brand: { type: ObjectId, required: true },
    name: String,
    price: Number,
    image: String,
    type: String,
    stock: Number,
    sold: Number,
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
        const result = model._doc;
        const brand = await brandModel.query(result.brand);
        result.brand = brand ? brand.name : 'Hãng khác';
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
};

exports.getPage = async (page) => {
    try {
        const products = await productModel.find().skip((page - 1) * perPage).limit(perPage);
        const result = products.map(async (product) => {
            const brand = await brandModel.query(product.brand);
            product._doc.brand = brand ? brand.name : 'Hãng khác';
            return product._doc;
        });
        return await Promise.all(result);
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.getCategory = async (name) => {
    try {
        const brand = await brandModel.queryByName(name);
        const products = productModel.find({ brand: brand[0]._id });
        const result = (await products.limit(perPage)).map(product => product._doc);
        const total = await products.countDocuments();
        return { total, data: result };
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.getList = async () => {
    try {
        const allList = productModel.find();
        const products = await allList.limit(perPage);
        const result = Promise.all(products.map(async (product) => {
            const brand = await brandModel.query(product.brand);
            product._doc.brand = brand ? brand.name : 'Hãng khác';
            return product._doc;
        }));
        result.total = await allList.countDocuments();
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.getHotItems = async () => {
    try {
        const products = await productModel.find().sort({ sold: -1 }).limit(10);
        const result = products.map(async (product) => {
            const brand = await brandModel.query(product.brand);
            product._doc.brand = brand ? brand.name : 'Hãng khác';
            return product._doc;
        });
        return await Promise.all(result);
    } catch (e) {
        console.log(e);
        return null;
    }
}