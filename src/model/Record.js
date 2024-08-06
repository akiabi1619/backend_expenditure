const mongoose = require('mongoose');

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
    required: false
  }
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
