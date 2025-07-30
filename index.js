const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');



// Load environment variables
require('dotenv').config({ quiet: true });

// Initialize Express app
const app = express();


//Import Models
const User = require('./models/user')



//Routes
const login = require('./routes/userRoutes')

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Enable CORS for all origins
app.use(cors());


// Set the routing
app.use('/api', login)



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
