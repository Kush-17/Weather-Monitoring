const { storeOrUpdateWeather } = require('../services/weatherService');
const db = require('../db/firebase').db; // Correct the import to destructure db
const colors = require('colors');

// Function to manually fetch and store weather data
exports.getWeather = async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).send("City is required.");
    }

    try {
        await storeOrUpdateWeather(city);
        res.status(200).send("Weather data stored successfully.");
    } catch (error) {
        res.status(500).send(`Error storing weather data: ${error.message}`);
    }
};

// Function to retrieve the daily summary for a city
exports.getDailySummary = async (req, res) => {
    const city = req.query.city;

    try {
        const summaryDoc = await db.collection('daily_summaries').doc(city).get();

        if (!summaryDoc.exists) {
            return res.status(404).send(`No daily summary found for ${city}`);
        }

        const summaryData = summaryDoc.data();

        const responseData = {
            city: summaryData.city,
            maxTemp: summaryData.maxTemp,
            minTemp: summaryData.minTemp,
            temp: summaryData.avgTemp,
            avgTemp: summaryData.avgTemp,
            updatesCount: summaryData.count,
            dominantWeather: summaryData.dominantWeather,
            feels_like: summaryData.feelsLike,
            weather: summaryData.weatherDescription,
            timestamps: new Date().toISOString(),
            time: {
                _seconds: Math.floor(Date.now() / 1000),
                _nanoseconds: 0
            }
        };

        console.log(colors.green(`Daily summary data for ${city}:`));
        console.log(colors.blue(JSON.stringify(responseData, null, 2)));

        res.status(200).json(responseData);
    } catch (error) {
        console.error(colors.red(`Error retrieving daily summary: ${error.message}`));
        res.status(500).send(`Error retrieving daily summary: ${error.message}`);
    }
};
