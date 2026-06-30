const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    baseUrl: {
        type: String,
        required: true
    },
    docsUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true  
    },
    description: {
        type: String,
        required: true
    },
    favourite: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true
    }

);

console.log("Schema paths:");
console.log(Object.keys(apiSchema.paths));

module.exports = mongoose.model('Api', apiSchema);
