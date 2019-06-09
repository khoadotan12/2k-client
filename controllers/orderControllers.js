const orderModel = require('../models/order');
const { formatPrice } = require('../global');

exports.home = async (req, res, next) => {
    const id = req.user._id;
    const data = await orderModel.list(id);
    data.forEach(order => {
        order.price = formatPrice(order.price);
        switch (order.status) {
            case 0:
                order.status = 'Đặt hàng thành công';
                break;
            case 1:
                order.status = 'Đang giao hàng';
                break;
            case 2:
                order.status = 'Đã giao hàng';
                break;
            case -1:
                order.status = 'Đã hủy';
                break;
            default:
                break;
        }
    });
    res.render('order/history', { title: 'Đơn hàng của bạn', data, user: req.user })
};