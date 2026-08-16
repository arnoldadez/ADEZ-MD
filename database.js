const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const SettingsSchema = new mongoose.Schema({
    groupId: String,
    setting: String,
    value: String
});

const UserSchema = new mongoose.Schema({
    number: String,
    name: String,
    lastSeen: Date
});

const Settings = mongoose.model('Settings', SettingsSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Settings, User };
