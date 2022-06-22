const User = require('../model/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('authentication/register');
}

module.exports.renderLoginForm = (req, res) => {
    res.render('authentication/login');
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        res.redirect('/');
    } catch (e) {
        console.log('ERROR', e);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    res.redirect('/');
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    res.redirect('/login');
}