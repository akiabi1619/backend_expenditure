const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    id: integer,
    title: String,
    category:String,
    amount:double,
    date:String
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;




