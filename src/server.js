const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Record = require('./model/Record');
const Counter = require('./model/counter'); // Import the Counter model
const User = require('./model/User'); // Import the User model
const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect('mongodb+srv://akiabi72:X5UDw4UcjZrExJq@cluster0.b9wwtay.mongodb.net/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Function to get the next sequence value for a given sequence name
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  try {
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Create a new record
app.post('/records', async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const nextEid = await getNextSequenceValue('eid');

    const recordData = {
      eid: nextEid,
      title: req.body.title,
      category: req.body.category,
      amount: req.body.amount,
      date: req.body.date,
    };

    console.log('Record Data:', recordData);

    let record = new Record(recordData);
    console.log('Record to be saved:', record);

    record = await record.save();
    res.send(record);
  } catch (err) {
    console.error('Error:', err);
    res.status(400).send(err);
  }
});

// Get all records
app.get('/records', async (req, res) => {
  try {
    const records = await Record.find();
    res.send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a record by eid
app.get('/records/:eid', async (req, res) => {
  try {
    const record = await Record.findOne({ eid: req.params.eid });
    if (!record) return res.status(404).send('Record not found');
    res.send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a record by eid
app.put('/records/:eid', async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    const record = await Record.findOneAndUpdate(
      { eid: req.params.eid },
      { title, amount, date, category },
      { new: true }
    );

    if (!record) {
      return res.status(404).send('Record not found');
    }

    res.send(record);
  } catch (error) {
    res.status(500).send('Error updating record');
  }
});

// Delete a record by eid
app.delete('/records/:eid', async (req, res) => {
  try {
    const result = await Record.findOneAndDelete({ eid: req.params.eid });
    if (!result) {
      return res.status(404).send('Record not found');
    }
    res.send('Record deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting record');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
