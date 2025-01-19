const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  
const bodyParser = require('body-parser');  

// Initialize express app
const app = express();

app.use(bodyParser.json());

const registerRoutes = require('./routes/registerRoutes');

app.use('/api', registerRoutes);

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.va6t2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
