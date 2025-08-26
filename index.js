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
require('./models/claimEntry')



//Routes
const login = require('./routes/userRoutes')
const staffmanage = require('./routes/staffRoutes')
const claimmanage = require('./routes/claimManageRoute')
const claimentry = require('./routes/claimEntryRoute')
const cliamReport = require('./routes/claimReport')
const Setting = require('./routes/settingRoute')
const Dashboard = require('./routes/dashboardRoute')
const PaymentProcess = require('./routes/paymentProcess')

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Enable CORS for all origins
app.use(cors());


// Set the routing
app.use('/api', login)
app.use('/api', claimmanage)
app.use('/api/staff', staffmanage)
app.use('/api', claimentry)
app.use('/api', cliamReport)
app.use('/api', Setting)
app.use('/api', Dashboard)
app.use('/api/finance', PaymentProcess)




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
