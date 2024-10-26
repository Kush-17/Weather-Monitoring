const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

// Endpoint to get weather data for a city
router.get('/getWeather', weatherController.getWeather);

// Endpoint to get daily summary for a city
router.get('/dailySummary', weatherController.getDailySummary);

module.exports = router;
