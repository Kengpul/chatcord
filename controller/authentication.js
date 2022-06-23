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
        req.flash('success', 'Successfully registered, you may now sign in!')
        res.redirect('/');
    } catch (e) {
        console.log('ERROR', e);
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