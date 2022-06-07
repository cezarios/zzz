const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    nickname: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    first_name: {type: String},
    last_name: {type: String},
    country: {type: String},
    roles: {type: String, default: "USER"},
    lastVisit: {type: Date, default: Date.now}
})

module.exports = model('User', userSchema)