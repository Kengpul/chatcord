const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/:room', (req, res) => {
    const { room } = req.params;
    res.render('chat/index', { room });
})

io.on('connection', socket => {
    socket.on('joinChat', room => {
        // TODO: add room to joined room in users array
        socket.join(room);
    })
    socket.on('message', (message, room) => {
        // TODO: add message to instance
        io.to(room).emit('displayMessage', message);
    })
    socket.on('createGroup', (groupName, description) => {
        // TODO: save new group to db
        io.emit('newGroup', groupName, description)
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`on port ${PORT}`);
})
