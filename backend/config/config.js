module.exports = {
    apiUrl: 'https://api.openweathermap.org/data/2.5/weather',  // OpenWeatherMap API base URL
    apiKey: process.env.WEATHER_API_KEY,  // Replace with your OpenWeatherMap API key
    //cities: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],  // List of cities you want to track
    interval: 60000,  // 1 minute interval for fetching weather data
    alertThresholds: {
        temperature: 35.0  // Threshold temperature for sending alerts
    }
};
