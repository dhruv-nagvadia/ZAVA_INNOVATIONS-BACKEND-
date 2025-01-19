const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connection URI
const dbURI = `mongodb+srv://dhruvnagvadia83:#2003@Dhruv@cluster0.va6t2.mongodb.net/zava?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB database:', process.env.DB_NAME);
})
.catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});
