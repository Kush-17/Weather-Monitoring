import React, { useEffect, useState } from 'react';
import './WeatherComponent.css';

const Weather = ({ city }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        try {
            // Step 1: Call getWeather to fetch and store data
            const weatherResponse = await fetch(`http://localhost:3001/api/getWeather?city=${city}`);
            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch and store weather data');
            }

            // Step 2: After storing, call dailySummary to retrieve the data
            const summaryResponse = await fetch(`http://localhost:3001/api/dailySummary?city=${city}`);
            if (!summaryResponse.ok) {
                throw new Error('Failed to fetch stored weather data');
            }
            const data = await summaryResponse.json();
            setWeatherData(data);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (city) { // Fetch only if city is not empty
            fetchWeatherData();
        }
    }, [city]);

    const formatTime = (timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString(); // Format date and time
        }
        return "Not available";
    };

    // Function to get weather emoji based on conditions
    const getWeatherEmoji = (condition) => {
        switch (condition) {
            case 'clear sky':
                return '☀️';
            case 'few clouds':
                return '🌤️';
            case 'scattered clouds':
                return '🌥️';
            case 'broken clouds':
                return '☁️';
            case 'shower rain':
                return '🌧️';
            case 'rain':
                return '🌧️';
            case 'thunderstorm':
                return '⛈️';
            case 'snow':
                return '❄️';
            default:
                return '🌈'; // Default emoji
        }
    };

    return (
        <div className="weather-card">
            <h2>Weather Summary for {city}</h2>
            {error ? (
                <p className="error-message">{error}</p>
            ) : weatherData ? (
                <div className="weather-details">
                    <p><strong>Temperature :</strong> {weatherData.temp.toFixed(2)} °C</p>
                    <p><strong>Feels Like :</strong> {weatherData.feels_like.toFixed(2)} °C</p>
                    <p><strong>Max Temp. :</strong> {weatherData.maxTemp.toFixed(2)} °C</p>
                    <p><strong>Min Temp. :</strong> {weatherData.minTemp.toFixed(2)} °C</p>
                    <p><strong>Average Temp. </strong> {weatherData.avgTemp.toFixed(2)} °C</p>
                    <p><strong>Condition :</strong> {weatherData.weather} ({getWeatherEmoji(weatherData.weather)})</p>
                    <p><strong>Last Updated :</strong> {formatTime(weatherData.timestamps)}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Weather;
