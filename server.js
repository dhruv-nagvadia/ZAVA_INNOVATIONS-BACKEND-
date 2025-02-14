// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const app = express();

// const registerRoute = require('./routes/Register');
// const loginRoute = require('./routes/Login');
// const eventRouter = require('./routes/AddEvent'); 
// const ParticipationRoutes = require('./routes/participation'); 


// dotenv.config();  

// app.use(cors());
// app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const uploadDir = './uploads/events';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   },
// });

// const upload = multer({ storage: storage });


// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log('Error connecting to MongoDB:', err));

// // Routes
// app.use('/api/register', registerRoute);
// app.use('/api/login', loginRoute);
// app.use('/api/events', eventRouter);
// app.use('/api/participate', ParticipationRoutes);


// app.get('/', (req, res) => {
//   res.send('Server is running');
// });

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

// Route Imports
const registerRoute = require('./routes/Register');
const loginRoute = require('./routes/Login');
const eventRouter = require('./routes/AddEvent');
const participateRoute = require('./routes/Participate'); // Corrected to match updated route

dotenv.config();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Static Files (for serving images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure Upload Directory Exists
const uploadDir = './uploads/events';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory: ${uploadDir}`);
}

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Error: Missing MONGO_URI in .env file');
  process.exit(1); // Exit if the MongoDB URI is not configured
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/events', eventRouter); // Use eventRouter for events
app.use('/api/participate', participateRoute); // Corrected to match updated route

// CORS for image resources
app.get('/uploads/events/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', 'events', filename);
  res.sendFile(filePath); // Serve image file directly
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Server Initialization
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
