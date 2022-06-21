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
const ExpressError = require('./utils/ExpressError');

const Community = require('./model/community');

const URL = process.env.MONGO_URI || 'mongodb://localhost:27017/chatcord';
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', async (req, res) => {
    const communities = await Community.find({});
    res.render('index', { communities });
})

app.get('/:room', async (req, res) => {
    const { room } = req.params;
    const community = await Community.findOne({ name: room });
    res.render('chat/index', { room, community });
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
})

io.on('connection', socket => {
    socket.on('joinChat', room => {
        // TODO: add room to joined room in users array
        socket.join(room);
    })
    socket.on('message', async (message, room) => {
        io.to(room).emit('displayMessage', message);
        const community = await Community.findOne({ name: room });
        community.messages.push(message);
        community.save();
    })
    socket.on('createGroup', (name, description) => {
        const community = new Community({ name, description });
        community.save();
        io.emit('newGroup', name, description);
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`on port ${PORT}`);
})
