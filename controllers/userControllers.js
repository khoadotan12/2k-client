const SHA256 = require('crypto-js/sha256');
const userModel = require('../models/user');

exports.editGet = (req, res, next) => {
    res.render('account/edit', { title: 'Thông tin tài khoản', user: req.user })
};

exports.editPost = async (req, res) => {
    const newUser = req.body;
    const resp = await userModel.edit(req.session.passport.user, newUser);
    if (resp)
        return res.redirect('/');
    next(createError(404));
};