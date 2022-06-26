const Community = require('../model/community');
const Message = require('../model/message');
const moment = require('moment');

module.exports.index = async (req, res) => {
    const communities = await Community.find({});
    res.render('index', { communities });
}

module.exports.room = async (req, res) => {
    const { room } = req.params;
    const community = await Community.findOne({ name: room }).populate('messages');
    res.render('chat/index', { room, community });
}

module.exports.sockets = (io) => {
    io.on('connection', socket => {
        socket.on('joinChat', room => {
            // TODO: add room to joined room in users array
            socket.join(room);
        })
        socket.on('message', async (message, room, username) => {
            const community = await Community.findOne({ name: room });
            const chatMessage = new Message({ message, author: username });
            chatMessage.time = moment().format('h:mm a');
            community.messages.push(chatMessage);
            chatMessage.save();
            community.save();
            io.to(room).emit('displayMessage', chatMessage);
        })
        socket.on('createGroup', (name, description) => {
            const community = new Community({ name, description });
            community.save();
            io.emit('newGroup', name, description);
        })
    })
}