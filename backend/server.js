// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { checkForAlerts } = require('./controllers/alertController');
const weatherRoutes = require('./routes/weatherRoutes');
const colors = require('colors');


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Periodic checking for alerts
setInterval(checkForAlerts, 300000); // Check alerts every 5 minutes

// Register weather routes for manual data fetch
app.use('/api', weatherRoutes);

app.listen(port, () => {
    console.log(colors.green(`Server is running on port ${port}`));
});
