exports.formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.perPage = 3;

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

exports.isUnLoggedIn = (req, res, next) => {
    if (req.isUnauthenticated())
        return next();
    res.redirect('/');
}