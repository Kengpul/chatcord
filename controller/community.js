const Community = require('../model/community');

module.exports.index = async (req, res) => {
    const communities = await Community.find({});
    console.log(req.session)
    res.render('index', { communities });
}

module.exports.room = async (req, res) => {
    const { room } = req.params;
    const community = await Community.findOne({ name: room });
    res.render('chat/index', { room, community });
}

module.exports.sockets = (io) => {
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
}

