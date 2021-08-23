// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const windElement = document.querySelector(".wind-value p")
const notificationElement = document.querySelector(".notification");

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
}

// Show error if geolocation disabled
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get the data wanted from api
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api)

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); // Temp
            weather.description = data.weather[0].description;               // Description
            weather.iconId = data.weather[0].icon;                           // Icon
            weather.city = data.name;                                        // City name
            weather.country = data.sys.country;                              // Country name
            weather.wind = Math.round(data.wind.speed);                      // Wind speed
        })
        .then(function () {
            displayBackground();
            displayWeather();
        });
}

// Change background depending on if its day/night (using icon to check)
function displayBackground() {
    let background = document.querySelector('.container');
    let dayTime = weather.iconId.includes('d');
    let nightTime = weather.iconId.includes('n');

    if (dayTime == true) {
        background.style.backgroundColor = "yellow";
    } else if (nightTime == true) {
        background.style.backgroundColor = "pink";
    }
}

// Display weather data to UI
function displayWeather() {
    tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;  // Temp
    descElement.innerHTML = `${weather.description}`;                       // Description
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;     // Icon
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;      // City name Country name
    windElement.innerHTML = `${weather.wind}-mph`                           // Wind speed
    
    // console.log(iconElement)
    // console.log(weather)
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