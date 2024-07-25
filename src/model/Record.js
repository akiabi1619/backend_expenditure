const mongoose = require('mongoose');
// Get current date
var currentDate = moment();

// Format the date if needed
var formattedDate = currentDate.format('YYYY-MM-DD');

console.log(formattedDate); 

const RecordSchema = new mongoose.Schema({
    eid: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        
    }
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
