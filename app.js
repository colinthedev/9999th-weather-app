// Weather data API
const locationElement = document.querySelector(".location p");              // Location
const iconElement = document.querySelector(".weather-icon");                // Icon
const tempElement = document.querySelector(".temperature-value p");         // Temp
const descElement = document.querySelector(".temperature-description p");   // Short description
const descElementDaily = document.querySelector(".daily-description p");    // Daily description
const sunRiseElement = document.querySelector(".sun-rise");                 // Sunrise
const sunSetElement = document.querySelector(".sun-set");                   // Sunset
const windElement = document.querySelector(".wind-value");                  // Wind speed
const gustElement = document.querySelector(".wind-gusts");                  // Gust speed
const feelsLikeElement = document.querySelector(".feelslike-value");        // Feels-like
const humidityElement = document.querySelector(".humidity-value");          // Humidity 
const tempMinElement = document.querySelector(".temp_min");                 // Temp_min
const tempMaxElement = document.querySelector(".temp_max");                 // Temp_max
// Notification
const notificationElement = document.querySelector(".notification");        // Notification

// Store data 
const weather = {}
// Defaults
weather.temperature = {
    unit: "fahrenheit"
}

const KELVIN = 217;
const key = '30d77443b623e57c0152d3599ff2cb70';

// Get user position if location is enabled display error if disabled
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.getElementsByClassName.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation</p>";
}

// Set user position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
    getAirQuality(latitude, longitude);
}

// Show error if geolocation disabled
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get the weather data wanted from api
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api)

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.city = data.name;                                        // City name
            weather.country = data.sys.country;                              // Country name
            weather.iconId = data.weather[0].icon;                           // Icon
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); // Temp
            weather.description = data.weather[0].description;               // Short description
            weather.sunrise = convertTime(data.sys.sunrise);                 // Sunrise
            weather.sunset = convertTime(data.sys.sunset);                   // Sunset
            weather.wind = Math.round(data.wind.speed);                      // Wind speed
            weather.gust = Math.round(data.wind.gust);                       // Gust speed
            weather.feels_like = Math.floor(data.main.feels_like - KELVIN);  // Feels-like
            weather.humidity = data.main.humidity;                           // Humidity 
            weather.temp_min = Math.floor(data.main.temp_min - KELVIN);      // Temp_min
            weather.temp_max = Math.floor(data.main.temp_max - KELVIN);      // Temp_max
        })
        .then(function () {
            displayBackground();
            displayWeather();
        });
}

// Display weather data to UI
function displayWeather() {
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;                                      // City/Country name
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;                                     // Icon
    tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;                                  // Temp
    descElement.innerHTML = `${weather.description}`;                                                       // Short description
    descElementDaily.innerHTML = dailyDescription();                                                        // Daily description
    sunRiseElement.innerHTML = `<span class="lightText">Sunrise</span> <br>${weather.sunrise} AM`;          // Sunrise
    sunSetElement.innerHTML = `<span class="lightText">Sunset</span> <br>${weather.sunset} PM`;             // Sunset
    windElement.innerHTML = `<span class="lightText">Wind</span> <br>${weather.wind} mph`;                  // Wind speed
    gustElement.innerHTML = `<span class="lightText">Gust</span> <br>${weather.gust} mph`;                  // Gust speed
    feelsLikeElement.innerHTML = `<span class="lightText">Feels-like</span> <br>${weather.feels_like} °F`;  // Feels-like
    humidityElement.innerHTML = `<span class="lightText">Humidity</span> <br>${weather.humidity}%`;         // Humidity 
    tempMinElement.innerHTML = `<span class="lightText">Min-temp</span> <br>${weather.temp_min} °F`;        // Temp_min
    tempMaxElement.innerHTML = `<span class="lightText">Max-temp</span> <br>${weather.temp_max} °F`;        // Temp_max
}

// Daily description of weather forecast
function dailyDescription() {
    return `No meatballs today: ${weather.description} currently. The high will be ${weather.temp_max} °F with a low of ${weather.temp_min} °F`;
}

// Convert sunrise sunset times 
function convertTime(unixTime) {
    let dt = new Date(unixTime * 1000)
    let h = dt.getHours() - 12
    let m = "0" + dt.getMinutes()
    let t = h + ":" + m.substr(-2)
    return t.includes('-') ? t.substring(1)
        : t
}

// Change background depending on if its day/night (using icon to check)
function displayBackground() {
    const background = document.querySelector('.container');
    const dayTime = weather.iconId.includes('d');
    const nightTime = weather.iconId.includes('n');
    const dayBackground = 'linear-gradient(15deg, rgba(248, 194, 130, 1), rgba(227, 130, 163, 1), rgba(145, 77, 214, 1))';
    const nightBackground = 'linear-gradient(15deg, rgba(108, 45, 189, 1), rgba(53, 32, 155, 1))';

    if (dayTime == true) {
        background.style.backgroundImage = `${dayBackground}`;
    } else if (nightTime == true) {
        background.style.backgroundImage = `${nightBackground}`;
    }
}

// Convert to C
function fahrenheitToCelsius(temperature) {
    return (temperature - 32) * 5 / 9;
}

// Switch between F and C
tempElement.addEventListener('click', function () {
    if (weather.temperature.value === undefined) return;
    if (weather.temperature.unit == 'celsius') {
        let fahrenheit = weather.temperature.value;

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        let celsius = fahrenheitToCelsius(weather.temperature.value)
        celsius = Math.floor(celsius)

        tempElement.innerHTML = `${celsius}°<span>C</span >`;
        weather.temperature.unit = 'celsius'
    }
})

// Air quality API
const airQualityElement = document.querySelector(".air_quality");
const airQualityDescription = document.querySelector(".air_quality_description");

const key2 = '19a61b27e0946e4952f2c218d9652722';

// Store data 
const airQuality = {};

// Get the air pollution data wanted from api
function getAirQuality(latitude, longitude) {
    let airQualityApi = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${key2}`;
    console.log(airQualityApi)

    fetch(airQualityApi)
        .then(function (response) {
            let pollutionData = response.json();
            return pollutionData;
        })
        .then(function (pollutionData) {
            airQuality.rating = pollutionData.list[0].main.aqi;
        })
        .then(function () {
            displayAirQuality();
            displayQualityDescription();
            airQualityGraph();
        });
}

// Display air quality rating
function displayAirQuality() {
    airQualityElement.innerHTML = `${airQuality.rating}`;
}

// Display air quality description
function displayQualityDescription() {
    return airQualityElement.innerHTML === '1' ? airQualityDescription.innerHTML = '&nbsp;Good'
        : airQualityElement.innerHTML === '2' ? airQualityDescription.innerHTML = '&nbsp;Fair'
            : airQualityElement.innerHTML === '3' ? airQualityDescription.innerHTML = '&nbsp;Moderate'
                : airQualityElement.innerHTML === '4' ? airQualityDescription.innerHTML = '&nbsp;Poor'
                    : airQualityElement.innerHTML === '5' ? airQualityDescription.innerHTML = '&nbsp;Very Poor'
                        : airQualityDescription.innerHTML = 'N/A'
}

// Graph air quality based off value
function airQualityGraph() {
    let currentActive = 1;
    let circle = document.querySelectorAll(".circle");

    [...circle].forEach(function (circle, idx) {
        if (idx < currentActive && airQualityElement.innerHTML === '1') {
            circle.classList.add('active');
            currentActive = 1;
        } else if (idx < currentActive && airQualityElement.innerHTML === '2') {
            circle.classList.add('active');
            currentActive = 2;
        } else if (idx < currentActive && airQualityElement.innerHTML === '3') {
            circle.classList.add('active-fair');
            currentActive = 3;
        } else if (idx < currentActive && airQualityElement.innerHTML === '4') {
            circle.classList.add('active-fair');
            currentActive = 4;
        } else if (idx < currentActive && airQualityElement.innerHTML === '5') {
            circle.classList.add('active-bad');
            currentActive = 5;
        } else {
            currentActive = 0;
        }
    })
}