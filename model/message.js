const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    message: String,
    author: String,
    time: String
})

module.exports = mongoose.model('Message', messageSchema);