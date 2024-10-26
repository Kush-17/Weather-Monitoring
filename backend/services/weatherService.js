const axios = require('axios');
const colors = require('colors');
const { db } = require('../db/firebase');
const config = require('../config/config');
const WeatherModel = require('../models/weatherModel');

// Function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
};

const fetchWeather = async (city) => {
    const url = `${config.apiUrl}?q=${city}&appid=${config.apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        const weatherData = new WeatherModel(
            data.name,
            kelvinToCelsius(data.main.temp),
            kelvinToCelsius(data.main.feels_like),
            data.weather[0].description,
            new Date(data.dt * 1000)
        );

        console.log(colors.green('Fetched Weather Data:'));
        console.log(colors.blue(JSON.stringify(weatherData, null, 2)));
        return weatherData;
    } catch (error) {
        console.error(colors.red(`Error fetching weather data for ${city}:`, error.message));
        throw error;
    }
};

const storeOrUpdateWeather = async (city) => {
    try {
        const weatherData = await fetchWeather(city);
        
        const weatherRef = db.collection('weather').doc(weatherData.city);

        await weatherRef.set({
            city: weatherData.city,
            temp: weatherData.temp,
            feelsLike: weatherData.feelsLike,
            weatherDescription: weatherData.weatherDescription,
            time: weatherData.time,
        }, { merge: true });
        
        await calculateDailySummary(weatherData);
        console.log(colors.green(`Weather data stored/updated for ${city}`));
    } catch (error) {
        console.error(colors.red(`Error storing weather data for ${city}:`, error));
    }
};

// Calculate daily summary
const calculateDailySummary = async (weatherData) => {
    try {
        const summaryRef = db.collection('daily_summaries').doc(weatherData.city);
        const summaryDoc = await summaryRef.get();

        if (summaryDoc.exists) {
            const summaryData = summaryDoc.data();
            summaryData.totalTemp += parseFloat(weatherData.temp);
            summaryData.count += 1;

            summaryData.avgTemp = summaryData.totalTemp / summaryData.count;
            summaryData.dominantWeather = weatherData.weatherDescription; // Update dominant weather

            await summaryRef.set(summaryData);
        } else {
            const newSummary = {
                city: weatherData.city,
                maxTemp: weatherData.temp,
                minTemp: weatherData.temp,
                avgTemp: weatherData.temp,
                count: 1,
                totalTemp: weatherData.temp,
                dominantWeather: weatherData.weatherDescription,
                feelsLike: weatherData.feelsLike,
                weatherDescription: weatherData.weatherDescription
            };

            await summaryRef.set(newSummary);
        }
    } catch (error) {
        console.error(colors.red(`Error calculating daily summary for ${weatherData.city}:`, error));
    }
};

module.exports = { storeOrUpdateWeather };
