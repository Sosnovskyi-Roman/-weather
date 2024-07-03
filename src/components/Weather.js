import React, { useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "57460c4cf188e804d9b1abb8b4fb80e0";

  const fetchWeather = async (e) => {
    e.preventDefault();
    setError("");
    setWeather(null);
    setLoading(true);

    if (!city) {
      setError("Please enter a city name.");
      setLoading(false);
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setLoading(false);

      if (data.cod !== 200) {
        setError(data.message);
      } else {
        setWeather(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        try {
          setLoading(true);
          const response = await fetch(apiUrl);
          const data = await response.json();
          setLoading(false);

          if (data.cod !== 200) {
            setError(data.message);
          } else {
            setWeather(data);
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          setError("Failed to fetch weather data.");
          setLoading(false);
        }
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
        <button type="button" onClick={fetchWeatherByLocation}>
          Use Current Location
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Feels Like: {weather.main.feels_like} °C</p>
          <p>Humidity: {weather.main.humidity} %</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>
            Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>
            Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;
