const { formatPrice, getCartCount } = require('../global');

exports.home = (req, res, next) => {
    if (!req.session.products)
        return res.redirect('/');
    res.render('checkout/index', { title: 'Thanh toán', cartCount: getCartCount(req), data: req.session.cart.data, sum: formatPrice(req.session.cart.sum), user: req.user })
};

exports.done = (req, res, next) => {
    if (!req.session.products)
        return res.redirect('/');
    delete req.session.products;
    delete req.session.cartCount;
    delete req.session.cart;
    res.render('checkout/done', { user: req.user, title: 'Đặt hàng thành công' })
}
