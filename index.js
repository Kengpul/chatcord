if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const { sockets } = require('./controller/community');
const User = require('./model/user');

const communityRoutes = require('./routes/community');
const authenticationRoutes = require('./routes/authentication');

const URL = process.env.MONGO_URI || 'mongodb://localhost:27017/chatcord';
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const store = MongoDBStore.create({
    mongoUrl: URL,
    secret: 'thisissecretkey', // to be replace
    touchAfter: 24 * 60 * 60
})

const sessionConfig = ({
    name: 'chatCord',
    store,
    secret: 'thisisasecretkeysseqw', // to be replace
    resave: false,
    saveUninitialized: true,
    secure: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
});

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

sockets(io);
app.use('/', authenticationRoutes);
app.use('/', communityRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
})


const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`on port ${PORT}`);
})
