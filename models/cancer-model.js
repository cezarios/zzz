const {Schema, model} = require('mongoose')

const cancerSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    age: {type: Number},
    country: {type: String},
    diagnosis: {type: String},
    stage: {type: Number, default: 1},
    collected: {type: Number, default: 0},
    goal: {type: Number, default: 1000}
})

module.exports = model('Cancer', cancerSchema)