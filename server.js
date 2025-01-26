const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB using the connection string in .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.log(err));

// Define a simple schema and model for demonstration
const Item = mongoose.model('Item', new mongoose.Schema({
  name: String,
  price: Number,
}));

// Route 1: GET request to fetch all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();  // Fetch all items from the database
    res.json(items);  // Send them as a response
  } catch (err) {
    res.status(500).send('Error fetching items');
  }
});

// Route 2: POST request to add a new item
app.post('/items', async (req, res) => {
  const { name, price } = req.body;  // Get item data from the request body
  try {
    const newItem = new Item({ name, price });  // Create a new item
    await newItem.save();  // Save it to the database
    res.status(201).json(newItem);  // Respond with the new item
  } catch (err) {
    res.status(500).send('Error adding item');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
