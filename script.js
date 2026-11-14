
/* =====================================
   1. API CONFIGURATION
===================================== */

const API_KEY = "0e9a9966b670416ffe82b99bddf4ce14";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";


/* =====================================
   2. HTML ELEMENTS SELECT KARNA
===================================== */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsDetail = document.getElementById("feelsDetail");
const visibility = document.getElementById("visibility");

const hourlyForecast = document.getElementById("hourlyForecast");
const weeklyForecast = document.getElementById("weeklyForecast");


/* =====================================
   3. CURRENT DATE
===================================== */

function showDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    currentDate.textContent = today.toLocaleDateString(
        "en-IN",
        options
    );

}


/* =====================================
   4. WEATHER ICON FUNCTION
===================================== */

function getWeatherIcon(condition) {

    const icons = {
        Clear: "☀️",
        Clouds: "☁️",
        Rain: "🌧️",
        Drizzle: "🌦️",
        Thunderstorm: "⛈️",
        Snow: "❄️",
        Mist: "🌫️",
        Smoke: "🌫️",
        Haze: "🌫️",
        Dust: "🌪️",
        Fog: "🌫️",
        Sand: "🌪️",
        Ash: "🌋",
        Squall: "💨",
        Tornado: "🌪️"
    };

    return icons[condition] || "🌤️";

}


/* =====================================
   5. LOADING FUNCTION
===================================== */

function showLoading() {

    cityName.textContent = "Loading...";
    temperature.textContent = "--°";
    weatherIcon.textContent = "⏳";

    weatherDescription.textContent =
        "Fetching weather information...";

    hourlyForecast.innerHTML =
        "<p>Loading hourly forecast...</p>";

    weeklyForecast.innerHTML =
        "<p>Loading weekly forecast...</p>";

}


/* =====================================
   6. ERROR FUNCTION
===================================== */

function showError(message) {

    cityName.textContent = "Weather Unavailable";

    temperature.textContent = "--°";
    weatherIcon.textContent = "⚠️";

    weatherCondition.textContent = "Error";

    weatherDescription.textContent = message;

    hourlyForecast.innerHTML = "";
    weeklyForecast.innerHTML = "";

}


/* =====================================
   7. FETCH CURRENT WEATHER
===================================== */

async function getCurrentWeather(city) {

    const url = `${WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found! Please try another city.");
    }

    const data = await response.json();

    return data;

}


/* =====================================
   8. FETCH FORECAST DATA
===================================== */

async function getForecast(city) {

    const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to load forecast data.");
    }

    const data = await response.json();

    return data;

}


/* =====================================
   9. DISPLAY CURRENT WEATHER
===================================== */

function displayCurrentWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    temperature.textContent =
        `${Math.round(data.main.temp)}°`;

    feelsLike.textContent =
        `Feels like ${Math.round(data.main.feels_like)}°`;

    weatherCondition.textContent =
        data.weather[0].main;

    weatherIcon.textContent =
        getWeatherIcon(data.weather[0].main);

    weatherDescription.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    feelsDetail.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    visibility.textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;

}


/* =====================================
   10. DISPLAY HOURLY FORECAST
===================================== */

function displayHourlyForecast(data) {

    hourlyForecast.innerHTML = "";

    const hours = data.list.slice(0, 5);

    hours.forEach((item, index) => {

        const date = new Date(item.dt * 1000);

        const time = index === 0
            ? "Now"
            : date.toLocaleTimeString("en-IN", {
                hour: "numeric",
                hour12: true
            });

        const icon = getWeatherIcon(
            item.weather[0].main
        );

        const temp = Math.round(item.main.temp);

        const card = document.createElement("div");

        card.className = "forecast-card card";

        card.innerHTML = `
            <p>${time}</p>
            <span>${icon}</span>
            <h3>${temp}°</h3>
        `;

        hourlyForecast.appendChild(card);

    });

}


/* =====================================
   11. DISPLAY 5 DAY FORECAST
===================================== */

function displayWeeklyForecast(data) {

    weeklyForecast.innerHTML = "";

    const dailyData = {};

    data.list.forEach(item => {

        const date = new Date(item.dt * 1000);

        const day = date.toLocaleDateString(
            "en-CA"
        );

        if (!dailyData[day]) {

            dailyData[day] = {
                temps: [],
                weather: item.weather[0].main
            };

        }

        dailyData[day].temps.push(item.main.temp);

    });


    const days = Object.keys(dailyData).slice(1, 6);

    days.forEach(day => {

        const dayData = dailyData[day];

        const date = new Date(day + "T12:00:00");

        const dayName = date.toLocaleDateString(
            "en-IN",
            { weekday: "long" }
        );

        const maxTemp = Math.round(
            Math.max(...dayData.temps)
        );

        const minTemp = Math.round(
            Math.min(...dayData.temps)
        );

        const icon = getWeatherIcon(
            dayData.weather
        );

        const card = document.createElement("div");

        card.className = "weekly-card card";

        card.innerHTML = `
            <p>${dayName}</p>
            <span>${icon}</span>
            <h3>${maxTemp}° / ${minTemp}°</h3>
        `;

        weeklyForecast.appendChild(card);

    });

}


/* =====================================
   12. MAIN WEATHER FUNCTION
===================================== */

async function searchWeather(city) {

    if (!city.trim()) {

        alert("Please enter a city name!");

        return;

    }

    if (API_KEY === "YOUR_API_KEY_HERE") {

        showError("Please add your OpenWeather API key in script.js.");

        return;

    }

    showLoading();

    try {

        const [weatherData, forecastData] =
            await Promise.all([
                getCurrentWeather(city),
                getForecast(city)
            ]);

        displayCurrentWeather(weatherData);

        displayHourlyForecast(forecastData);

        displayWeeklyForecast(forecastData);

    }

    catch (error) {

        showError(error.message);

        console.error("Weather Error:", error);

    }

}


/* =====================================
   13. SEARCH BUTTON EVENT
===================================== */

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    searchWeather(city);

});


/* =====================================
   14. ENTER KEY EVENT
===================================== */

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        searchWeather(city);

    }

});


/* =====================================
   15. DEFAULT CITY WEATHER
===================================== */

showDate();

searchWeather("Agra");
