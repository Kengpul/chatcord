module.exports.renderRegisterForm = (req, res) => {
    res.render('authentication/register');
}

module.exports.renderLoginForm = (req, res) => {
    res.render('authentication/login');
}