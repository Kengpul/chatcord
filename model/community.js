const mongoose = require('mongoose');
const { Schema } = mongoose;

const communitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    messages: [
        {
            type: String,
        }
    ]
})

module.exports = mongoose.model('Community', communitySchema);