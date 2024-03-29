exports.formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.perPage = 6;

exports.saltRounds = 10;

exports.brandsSchemaName = 'brands';

exports.usersSchemaName = 'users';

exports.productsSchemaName = 'products';

exports.ordersSchemaName = 'orders';

exports.emailFail = 'Email đã được sử dụng.';

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
};

exports.isUnLoggedIn = (req, res, next) => {
    if (req.isUnauthenticated())
        return next();
    res.redirect('/');
};

exports.getCartCount = req => {
    return req.session.cartCount;
}

exports.secretSession = 'J50@xz1AP47xc60';

exports.secretKeyVerify = 'QOtdUf3WbaXC54PGaSWH';

exports.secretKeyRecover = 'vEltKSpAbTBlRb8Z31G4';

exports.emailInfo = {
    user: '2k.mobileshop.1512241@gmail.com',
    pass: 'mobileshop2k'
}
