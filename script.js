// script.js

const apiKey = "03d1755bd56cac8112ef3685f5409e79";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");

const forecastContainer = document.getElementById("forecastContainer");
const dateTime =
document.getElementById("dateTime");

function updateTime(){

  const now = new Date();

  dateTime.innerText =
    now.toLocaleString();

}

setInterval(updateTime,1000);

updateTime();

// CURRENT WEATHER
async function getWeather(cityName) {

  try {
    // LOADING TEXT

temp.innerText = "Loading...";
condition.innerText = "Fetching weather...";
city.innerText = cityName;

    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    const response = await fetch(weatherURL);
    const data = await response.json();

    console.log(data);

    // ERROR HANDLING
    if (data.cod !== 200) {
      alert(data.message);
      return;
    }

    // UPDATE UI
    city.innerText = data.name;

    temp.innerText =
      `${Math.round(data.main.temp)}°C`;

    condition.innerText =
      data.weather[0].description;
    // DYNAMIC BACKGROUND

const weatherMain =
data.weather[0].main;

if(weatherMain === "Clouds"){

  document.body.style.background =
  "linear-gradient(135deg,#4b5563,#1f2937)";

}

else if(weatherMain === "Rain"){

  document.body.style.background =
  "linear-gradient(135deg,#0f172a,#334155)";

}

else if(weatherMain === "Clear"){

  document.body.style.background =
  "linear-gradient(135deg,#0ea5e9,#2563eb)";

}

else if(weatherMain === "Thunderstorm"){

  document.body.style.background =
  "linear-gradient(135deg,#111827,#000000)";

}

else if(weatherMain === "Snow"){

  document.body.style.background =
  "linear-gradient(135deg,#dbeafe,#93c5fd)";

}

else{

  document.body.style.background =
  "linear-gradient(135deg,#0f172a,#1e293b,#334155)";

}

    humidity.innerText =
      `${data.main.humidity}%`;

    wind.innerText =
      `${data.wind.speed} km/h`;

    feelsLike.innerText =
      `${Math.round(data.main.feels_like)}°C`;

    // WEATHER ICON
    const iconCode = data.weather[0].icon;

    weatherIcon.src =
      `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // LOAD FORECAST
    getForecast(cityName);

  }
  catch (error) {

    console.log(error);

    alert("Something went wrong");

  }

}


// FORECAST
async function getForecast(cityName) {

  try {

    forecastContainer.innerHTML = "";

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    const response = await fetch(forecastURL);

    const data = await response.json();

    console.log(data);

    // CHECK ERROR
    if (data.cod !== "200") {
      return;
    }

    // FILTER DAILY DATA
    const dailyData =
      data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      );

    dailyData.forEach(day => {

      const date = new Date(day.dt_txt);

      const dayName =
        date.toLocaleDateString("en-US", {
          weekday: "short"
        });

      const icon =
        day.weather[0].icon;

      const forecastCard =
        document.createElement("div");

      forecastCard.classList.add("forecast-card");

      forecastCard.innerHTML = `
        <h3>${dayName}</h3>

        <img
          src="https://openweathermap.org/img/wn/${icon}@2x.png"
        />

        <p>${day.weather[0].main}</p>

        <h2>${Math.round(day.main.temp)}°C</h2>
      `;

      forecastContainer.appendChild(forecastCard);

    });

  }
  catch (error) {

    console.log(error);

  }

}


// SEARCH BUTTON
searchBtn.addEventListener("click", () => {

  const cityName =
    cityInput.value.trim();

  if (cityName !== "") {

    getWeather(cityName);

  }

});


// ENTER KEY
cityInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {

    searchBtn.click();

  }

});


// DEFAULT WEATHER
getWeather("Hyderabad");