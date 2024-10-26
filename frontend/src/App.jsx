import React, { useState } from 'react';
import WeatherComponent from './components/Weather';
import './styles.css';

const App = () => {
  const [city, setCity] = useState(''); // Removed default city
  const [searchCity, setSearchCity] = useState(''); // Input handling

  const handleCityChange = (event) => {
    setSearchCity(event.target.value);
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      setSearchCity(''); // Clear input after search
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">Weather Monitoring System</h1>
      <div className="input-container">
        <input
          type="text"
          value={searchCity}
          onChange={handleCityChange}
          placeholder="Enter city name"
          className="city-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <WeatherComponent city={city} />
    </div>
  );
};

export default App;
