const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
  avatar: {
    type: String,
    default: '',
}
},

{timestamps: true}

);

module.exports = mongoose.model('User', userSchema);  