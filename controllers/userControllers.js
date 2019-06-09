
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
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
        return res.render('authen/register', { title: 'Đăng ký', emailFail })
    const plainTextPassword = newUser.password;
    newUser.password = await bcrypt.hash(plainTextPassword, saltRounds);
    newUser.active = false;
    return userModel.add(newUser).then((respUser, error) => {
        if (error)
            return res.status(500).send(error);
        mailOptions.to = newUser.email;
        mailOptions.html = 'hello';
        transporter.sendMail(mailOptions, error => {
            if (error) {
                return next(err);
            }
        });
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
};

exports.changePassword = async (req, res) => {
    const user = await userModel.getID(req.user);
    console.log(user);
    return res.render('account/changePass', { title: 'Đổi mật khẩu', user: req.user })
    // if (user)
    //     return res.send(emailFail);
    // return res.status(200).send();
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '2k.mobileshop.1512241@gmail.com',
        pass: 'mobileshop2k'
    }
});

const mailOptions = {
    to: 'someone@gmail.com',
    subject: 'Kích hoạt tài khoản Mobile Shop của bạn',
    html: 'Content'
};