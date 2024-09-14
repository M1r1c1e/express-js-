const express = require('express');
const bodyParser = require('body-parser');
const developerRoutes = require('./routes/developer');
const organizationRoutes = require('./routes/organization'); // Add this line

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the developer and organization routes
app.use('/api', developerRoutes);
app.use('/api', organizationRoutes); // Add this line

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
