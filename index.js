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

app.get('/:name', (req, res) => {
    res.render('chat/index');
})

io.on('connection', socket => {
    socket.on('message', message => {
        io.emit('displayMessage', message);
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`on port ${PORT}`);
})
