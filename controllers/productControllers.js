const productModel = require('../models/product');
const brandModel = require('../models/brand');
const createError = require('http-errors');
const { formatPrice, URL, perPage } = require('../global');

function parseData(raw) {
    const data = { ...raw };
    data.price = formatPrice(data.price);
    data.info.sim = data.info.sim.toString();
    data.info.RAM = data.info.RAM.toString() + ' GB';
    data.info.ROM = data.info.ROM.toString() + ' GB';
    data.info.PIN = data.info.PIN.toString() + ' mAh';
    data.info.Screen = data.info.Screen.toString() + ' inches';
    let shortInfo = [];
    shortInfo.push('Hệ điều hành: ' + data.info.OS);
    shortInfo.push('RAM: ' + data.info.RAM);
    shortInfo.push('ROM: ' + data.info.ROM);
    shortInfo.push('Chip xử lý: ' + data.info.CPU);
    data.shortInfo = [...shortInfo];
    data.image = URL + data.image;
    return data;
}
exports.home = async (req, res, next) => {
    const ram = [
        {
            size: '8 GB',
            count: '19',
        }, {
            size: '6 GB',
            count: '22',
        }, {
            size: '4 GB',
            count: '71',
        }, {
            size: '2 GB',
            count: '61',
        }];
    const color = {
        black: '41',
        yellow: '10',
        blue: '30',
        red: '22',
    }
    const data = {};
    const page = req.params.page ? parseInt(req.params.page) : 1;
    const rawlist = await productModel.getPage(page);
    const brands = await brandModel.list();
    data.brands = brands.map(item => {
        item._doc.name = item._doc.name.toLowerCase();
        return item._doc;
    });
    let total = 0;
    brands.forEach(item => total += item.count);
    const totalPage = Math.ceil(total / perPage);
    if (page > totalPage)
        return next(createError(404));
    if (rawlist) {
        data.items = rawlist.map(item => {
            const newitem = parseData(item._doc);
            const found = brands.find((element) => {
                return newitem.brand.toString() === element._id.toString();
            });
            newitem.brand = found.name;
            newitem.uri = newitem.brand.toLowerCase() + '/' + newitem._id;
            return newitem;
        });
        data.lastPage = page + 2 <= totalPage ? page + 2 : totalPage;
        data.firstPage = page + 2 <= totalPage ? page - 2 : page - 4 + (totalPage - page);
        data.firstPage = data.firstPage < 1 ? 1 : data.firstPage;
        if (data.lastPage < 5)
            if (totalPage >= 5)
                data.lastPage = 5;
            else if (totalPage >= 4)
                data.lastPage = 4;
        data.page = page;
    }
    else {
        return next(createError(404));
    }
    data.ram = ram;
    data.color = color;
    res.render('product/all', { user: req.user, title: 'Cửa hàng', data });
};

exports.brand = async (req, res, next) => {
    let brandName = req.params.category;
    brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
    const ram = [
        {
            size: '8 GB',
            count: '19',
        }, {
            size: '6 GB',
            count: '22',
        }, {
            size: '4 GB',
            count: '71',
        }, {
            size: '2 GB',
            count: '61',
        }];
    const color = {
        black: '41',
        yellow: '10',
        blue: '30',
        red: '22',
    }
    const data = {};
    const rawlist = await productModel.getCategory(brandName);
    if (rawlist)
        data.items = rawlist.data.map(item => {
            const newitem = parseData(item._doc);
            newitem.uri = req.params.category + '/' + newitem._id;
            return newitem;
        });
    data.ram = ram;
    data.color = color;
    res.render('product/brand', { user: req.user, title: brandName, data });
};

exports.info = async (req, res, next) => {
    const rawdata = await productModel.info(req.params.id);
    if (!rawdata)
        return next(createError(404));
    const brand = await brandModel.query(rawdata.brand);
    rawdata.brand = brand ? brand.name : 'Hãng khác';
    const data = parseData(rawdata);

    const related = await productModel.getRelatedProducts(brand._id, req.params.id);
    if (related)
        data.related = related.map(item => {
            const newitem = parseData(item._doc);
            newitem.uri = newitem._id;
            return newitem;
        });
    res.render('product/info', { user: req.user, title: data.name, data })
};

exports.search = (req, res, next) => {
    const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo'];
    const ram = ['8 GB',
        '6 GB',
        '4 GB',
        '2 GB',
    ];
    const data = {

    }
    data.brands = brands;
    data.ram = ram;
    res.render('product/search', { user: req.user, title: 'Tìm kiếm', data });
};