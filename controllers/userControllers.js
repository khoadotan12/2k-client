
const userModel = require('../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { saltRounds, emailFail, secretKeyVerify, secretKeyRecover, emailInfo } = require('../global');

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
    res.render('authen/login', { referer: req.headers.referer, title: 'Đăng nhập', message: req.flash('loginMessage') })
};

exports.loginPost = (req, res) => {
    if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-11) !== "/user/login")) {
        res.redirect(req.body.referer);
    } else {
        res.redirect("/");
    }
};


exports.recoverGet = (req, res) => {
    res.render('authen/recover', { title: 'Quên mật khẩu' })
};

exports.recoverPost = async (req, res, next) => {
    const host = req.hostname;
    const email = req.body.email;
    const user = await userModel.getEmail(email);
    if (!user)
        return res.render('authen/recover', { title: 'Quên mật khẩu', message: 'Email không hợp lệ.' });
    const payload = {
        id: user._id
    };
    const token = jwt.sign(payload, secretKeyRecover, { expiresIn: 900 });
    const url = req.protocol + '://' + host + (host === 'localhost' ? ':3000' : '') + '/user/reset/' + user._id + '/' + token;
    mailOptions.to = user.email;
    mailOptions.from = '"Phones Shop - Khôi phục mật khẩu" <2k.mobileshop.1512241@gmail.com>';
    mailOptions.subject = 'Đặt lại mật khẩu tài khoản Phones Shop';
    mailOptions.html = 'Xin chào ' + user.name + ',<br />Nhấn vào link sau để đặt lại mật khẩu của bạn: ' + url + '<br />Link thay đổi mật khẩu chỉ tồn tại trong 15 phút, vui lòng sử dụng lại chức năng quên mật khẩu nếu link trên đã hết hiệu lực.';
    transporter.sendMail(mailOptions, error => {
        if (error) {
            return next(err);
        }
    });
    return res.render('account/active', { title: 'Quên mật khẩu', message: 'Vui lòng kiểm tra email đã được gửi đến ' + email + ' để lấy lại mật khẩu của bạn.' });
};

exports.resetGet = (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;
    jwt.verify(token, secretKeyRecover, (err, decoded) => {
        if (err) {
            return res.status(200).send('Đường dẫn không hợp lệ hoặc đã hết hạn.');
        } else {
            if (id !== decoded.id)
                return res.status(200).send('Đường dẫn không hợp lệ.');
            return res.render('account/reset', { title: 'Đặt lại mật khẩu mới' });
        }
    });
};

exports.resetPost = (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;
    jwt.verify(token, secretKeyRecover, async (err, decoded) => {
        if (err) {
            return res.status(200).send('Đường dẫn không hợp lệ hoặc đã hết hạn.');
        } else {
            if (id !== decoded.id)
                return res.status(200).send('Đường dẫn không hợp lệ.');
            const plainTextPassword = req.body.password;
            const newHashPassword = await bcrypt.hash(plainTextPassword, saltRounds);
            const user = await userModel.updatePassword(id, newHashPassword);
            if (!user)
                return res.status(200).send('Đường dẫn không hợp lệ.');
            return res.render('account/done', { title: 'Đặt lại mật khẩu thành công', message: 'Mật khẩu của bạn đã được thay đổi.' });
        }
    });
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
        sendMail(req.protocol, respUser, host, next);
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
    sendMail(req.protocol, user, host, next);
    return res.render('account/active', { user, title: 'Kích hoạt tài khoản', message: 'Email kích hoạt tài khoản đã được gửi đến email đăng ký tài khoản. Email kích hoạt tài khoản chỉ có hiệu lực trong 15 phút.' })
};

exports.active = (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    jwt.verify(token, secretKeyVerify, async (err, decoded) => {
        if (err) {
            return res.status(200).send('Đường dẫn không hợp lệ hoặc đã hết hạn.');
        } else {
            if (id !== decoded.id)
                return res.status(200).send('Đường dẫn không hợp lệ.');
            const user = await userModel.active(id);
            if (!user)
                return res.status(200).send('Đường dẫn không hợp lệ.');
            req.login(user, err => {
                if (err)
                    return next(err);
                return res.render('account/done', { user, title: 'Kích hoạt tài khoản thành công', message: 'Tài khoản của bạn đã được kích hoạt.' });
            });
        }
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: emailInfo,
});

const mailOptions = {
    from: 'Phones Shop',
    to: 'someone@gmail.com',
    subject: 'Kích hoạt tài khoản Phones Shop của bạn',
    html: ''
};

function sendMail(protocol, user, host, next) {
    const payload = {
        id: user._id
    };
    const token = jwt.sign(payload, secretKeyVerify, { expiresIn: 900 });
    const url = protocol + '://' + host + (host === 'localhost' ? ':3000' : '') + '/user/active/' + user._id + '/' + token;
    mailOptions.to = user.email;
    mailOptions.from = '"Phones Shop - Kích hoạt tài khoản" <2k.mobileshop.1512241@gmail.com>';
    mailOptions.html = 'Xin chào ' + user.name + ',<br />Nhấn vào link sau để kích hoạt tài khoản của bạn: ' + url + '<br />Link kích hoạt chỉ tồn tại trong 15 phút, vui lòng kích hoạt lại tài khoản nếu link trên đã hết hiệu lực.';
    transporter.sendMail(mailOptions, error => {
        if (error) {
            return next(err);
        }
    });
}