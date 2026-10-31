const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');

// Replace with your free OpenWeatherMap API key
const apiKey = 'YOUR_API_KEY_HERE'; 

async function fetchWeather(city) {
    if (!city) return;

    weatherResult.innerHTML = `<p>Loading weather data for ${city}...</p>`;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(response.status === 404 ? 'City not found. Please check spelling.' : 'Unable to fetch weather data.');
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        weatherResult.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, sys, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherResult.innerHTML = `
        <div class="weather-info">
            <h3>${name}, ${sys.country}</h3>
            <img src="${iconUrl}" alt="${weather[0].description}" style="width: 60px; height: 60px; margin: -10px 0;">
            <div class="temp">${Math.round(main.temp)}°C</div>
            <p style="text-transform: capitalize; margin: 0; font-weight: 500;">${weather[0].description}</p>
            <div class="details">
                <span>Humidity: <strong>${main.humidity}%</strong></span>
                <span>Wind: <strong>${wind.speed} m/s</strong></span>
            </div>
        </div>
    `;
}

// Event Listeners for Search
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value.trim());
    }
});
