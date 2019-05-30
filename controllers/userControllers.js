
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const { saltRounds, emailFail } = require('../global');

exports.editGet = (req, res, next) => {
    res.render('account/edit', { title: 'Thông tin tài khoản', user: req.user })
};

exports.editPost = async (req, res) => {
    const newUser = req.body;
    const resp = await userModel.edit(req.user, newUser);
    if (resp)
        return res.redirect('/');
    next(createError(404));
};

exports.loginGet = (req, res) => {
    res.render('authen/login', { title: 'Đăng nhập', message: req.flash('loginMessage') })
};

exports.recoverGet = (req, res) => {
    res.render('authen/recover', { title: 'Quên mật khẩu' })
};

exports.registerGet = (req, res) => {
    res.render('authen/register', { title: 'Đăng ký' })
};

exports.registerPost = async (req, res, next) => {
    const newUser = req.body;
    const isUserExisted = await userModel.getEmail(newUser.email);
    if (isUserExisted)
        return  res.render('authen/register', { title: 'Đăng ký', emailFail})
    const plainTextPassword = newUser.password;
    newUser.password = await bcrypt.hash(plainTextPassword, saltRounds);
    return userModel.add(newUser).then((respUser, error) => {
        if (error)
            return res.status(500).send(error);
        req.login(respUser, err => {
            if (err)
                return next(err);
            return res.redirect('/');
        });
    });
}

exports.verifyEmail = async (req, res) => {
    const user = await userModel.getEmail(req.body.email);
    if (user)
        return res.send(emailFail);
    return res.status(200).send();
}

exports.logout = (req, res) => {
    req.session.destroy();
    req.logout();
    res.clearCookie('connect.sid');
    res.redirect('/');
}