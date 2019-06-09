
const userModel = require('../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { saltRounds, emailFail, secretSign, emailInfo } = require('../global');

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
        return res.render('authen/register', { title: 'Đăng ký', emailFail })
    const plainTextPassword = newUser.password;
    newUser.password = await bcrypt.hash(plainTextPassword, saltRounds);
    newUser.active = false;
    return userModel.add(newUser).then((respUser, error) => {
        if (error)
            return res.status(500).send(error);
        const host = req.hostname;
        sendMail(respUser, host, next);
        req.login(respUser, err => {
            if (err)
                return next(err);
            return res.render('account/active', { user: respUser, title: 'Kích hoạt tài khoản', message: 'Email kích hoạt tài khoản đã được gửi đến email đăng ký tài khoản. Email kích hoạt tài khoản chỉ có hiệu lực trong 15 phút.' })
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
};

exports.changePasswordGet = async (req, res) => {
    return res.render('account/changePass', { title: 'Đổi mật khẩu', user: req.user });
}

exports.changePasswordPost = async (req, res, next) => {
    const user = await userModel.getID(req.user);
    if (!user)
        return next(createError(404));
    const compare = await bcrypt.compare(req.body.old_password, user.password);
    if (compare) {
        const plainTextPassword = req.body.password;
        const newHashPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        const update = await userModel.updatePassword(user._id, newHashPassword);
        return res.redirect('/');
    }
    else
        return res.render('account/changePass', { title: 'Đổi mật khẩu', user: req.user, message: 'Mật khẩu cũ không chính xác.' })
}

exports.sendMail = async (req, res, next) => {
    const host = req.hostname;
    const user = await userModel.getID(req.user);
    if (!user)
        return next(createError(404));
    if (user.active)
        return res.redirect('/');
    sendMail(user, host, next);
    return res.render('account/active', { user, title: 'Kích hoạt tài khoản', message: 'Email kích hoạt tài khoản đã được gửi đến email đăng ký tài khoản. Email kích hoạt tài khoản chỉ có hiệu lực trong 15 phút.' })
};

exports.active = (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    jwt.verify(token, secretSign, async (err, decoded) => {
        if (err) {
            return res.status(200).send('Link kích hoạt không hợp lệ hoặc đã hết hạn.');
        } else {
            if (id !== decoded.id)
                return res.status(200).send('Link kích hoạt không hợp lệ.');
            const user = await userModel.active(id);
            if (!user)
                return res.status(200).send('Link kích hoạt không hợp lệ.');
            req.login(user, err => {
                if (err)
                    return next(err);
                return res.redirect('/');
            });
        }
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: emailInfo,
});

const mailOptions = {
    to: 'someone@gmail.com',
    subject: 'Kích hoạt tài khoản Mobile Shop của bạn',
    html: ''
};

function sendMail(user, host, next) {
    const payloadActive = {
        id: user._id
    };
    const token = jwt.sign(payloadActive, secretSign, { expiresIn: 900 });
    const port = process.env.PORT || '3000';
    const url = 'http://' + host + (port === '80' ? '' : (':' + port)) + '/user/active/' + user._id + '/' + token;
    mailOptions.to = user.email;
    mailOptions.html = 'Xin chào ' + user.name + ',<br />Nhấn vào link sau để kích hoạt tài khoản của bạn: ' + url + '<br />Link kích hoạt chỉ tồn tại trong 15 phút, vui lòng kích hoạt lại tài khoản nếu link trên đã hết hiệu lực.';
    transporter.sendMail(mailOptions, error => {
        if (error) {
            return next(err);
        }
    });
}