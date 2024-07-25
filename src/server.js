const express = require('express');
const mongoose = require('mongoose');
const Record = require('./model/Record'); // Assuming Record model is correctly defined in './model/Record'
// const moment = require('moment');


// // Get current date
// var currentDate = moment();

// Format the date if needed
// var formattedDate = currentDate.format('YYYY-MM-DD');

// console.log(formattedDate); // Output: current date in YYYY-MM-DD format


const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://akiabi72:X5UDw4UcjZrExJq@cluster0.b9wwtay.mongodb.net/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Create a Record
app.post('/records', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body

    // Set the current date if not provided
    const recordData = {
      eid: req.body.eid,
      title: req.body.title,
      category: req.body.category,
      amount: req.body.amount,
      date: req.body.date 
    };
    
    console.log('Record Data:', recordData); // Log the record data before saving

    let record = new Record(recordData);
    console.log('Record to be saved:', record); // Log the record to be saved

    record = await record.save();
    res.send(record);
  } catch (err) {
    console.error('Error:', err); // Log the error
    res.status(400).send(err);
  }
});

// Get All Records
app.get('/records', async (req, res) => {
  try {
    const records = await Record.find();
    res.send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a Single Record by eid
app.get('/records/:eid', async (req, res) => {
  try {
    const record = await Record.findOne({ eid: req.params.eid });
    if (!record) return res.status(404).send('Record not found');
    res.send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a Record by eid
app.put('/records/:eid', async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { eid: req.params.eid },
      {
        title: req.body.title,
        category: req.body.category,
        amount: req.body.amount,
        date: req.params.date
      },
      { new: true }
    );
    if (!record) return res.status(404).send('Record not found');
    res.send(record);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a Record by eid
app.delete('/records/:eid', async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({ eid: req.params.eid });
    if (!record) return res.status(404).send('Record not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
