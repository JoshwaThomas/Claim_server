const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');



// Load environment variables
require('dotenv').config({ quiet: true });

// Initialize Express app
const app = express();


//Import Models
require('./models/user')
require('./models/claimtype')
require('./models/staffmanage')



//Routes
const login = require('./routes/userRoutes')
const staffmanage = require('./routes/staffRoutes')

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Enable CORS for all origins
app.use(cors());


// Set the routing
app.use('/api', login)
app.use('/api', staffmanage)



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
