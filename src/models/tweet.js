'use stric'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var TweetSchema = Schema({
    body: String,
    fecha: Date,
    usuario: { type: Schema.ObjectId, ref: 'categoria' },
})

module.exports = mongoose.model('tweet', TweetSchema);