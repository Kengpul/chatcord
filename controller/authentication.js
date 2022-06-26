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
        req.flash('success', 'Successfully registered, you may now log in!');
        res.redirect('/login');
    } catch (e) {
        if (e.name === 'UserExistsError') {
            req.flash('error', e.message);
        } else if (e.code === 11000) {
            req.flash('error', 'Email already in use');
        } else {
            req.flash('error', 'Something went wrong');
        }
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Successfully logged in!');
    res.redirect('/');
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    req.flash('success', 'Bye')
    res.redirect('/login');
}
