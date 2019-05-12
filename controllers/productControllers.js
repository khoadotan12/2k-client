const productModel = require('../models/product');
const brandModel = require('../models/brand');

const createError = require('http-errors');
const { formatPrice } = require('../global');

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
    const rawlist = await productModel.getList(1);
    const brands = await brandModel.list();
    data.brands = brands;
    if (rawlist)
        data.items = rawlist.map(item => {
            const newitem = parseData(item);
            newitem.uri = newitem.brand.toLowerCase() + '/' + newitem._id;
            return newitem;
        });
    data.ram = ram;
    console.log('Data: ', data);
    data.color = color;
    res.render('product/all', { title: 'Cửa hàng', data });
};

exports.info = async (req, res, next) => {
    const rawdata = await productModel.info(req.params.id);
    if (!rawdata)
        return next(createError(404));
    const data = parseData(rawdata);
    res.render('product/info', { title: data.name, data })
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
    res.render('product/search', { title: 'Tìm kiếm', data });
};