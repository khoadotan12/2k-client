exports.formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.perPage = 3;

exports.URL = "https://admin-2k.herokuapp.com";

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

exports.secretSession = 'J50@xz1AP47xc60';

exports.secretSign = 'QOtdUf3WbaXC54PGaSWH';

exports.emailInfo = {
    user: '2k.mobileshop.1512241@gmail.com',
    pass: 'mobileshop2k'
}