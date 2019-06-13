const mongoose = require('mongoose');
const brandModel = require('./brand');
const { perPage, productsSchemaName } = require('../global');

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
    colors: [String],
    info: {
        RAM: Number,
        CPU: String,
        ROM: Number,
        PIN: Number,
        OS: String,
        Screen: Number,
        sim: Number,
        frontCamera: String,
        backCamera: String,
    }
});
const productModel = mongoose.model(productsSchemaName, ProductSchema);

exports.info = async (id) => {
    try {
        const model = await productModel.findById(id);
        return model._doc;
    } catch (e) {
        return null;
    }
};

exports.getPage = async (page) => {
    try {
        const products = await productModel.find().skip((page - 1) * perPage).limit(perPage);
        return products;
    } catch (e) {
        return null;
    }
}

exports.getCategory = async (name) => {
    try {
        const brand = await brandModel.queryByName(name);
        const products = productModel.find({ brand: brand._id });
        const result = await products.limit(10);
        if (result) {
            const total = await products.countDocuments();
            return { total, data: result };
        }
        return null;
    } catch (e) {
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
        return null;
    }
}

exports.getRelatedProducts = async (brand, id) => {
    try {
        return await productModel.find({ brand }).where('_id').ne(id).limit(10);
    } catch (e) {
        return null;
    }
}

exports.increaseSold = async (id, sold) => {
    try {
        const product = await productModel.findById(id);
        if (product) {
            const newSold = product.sold ? (product.sold + sold) : sold; 
            return await productModel.findByIdAndUpdate(id, { sold: newSold });
        }
        else
            return null;
    } catch (e) {
        return null;
    }
}
