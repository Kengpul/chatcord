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
const ExpressError = require('./utils/ExpressError');
const { sockets } = require('./controller/community');

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
