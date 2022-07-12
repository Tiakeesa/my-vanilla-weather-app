function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function callForecastHour(coordinates) {
  let apiKey = `b95e4d9ece25e5d23a804d0d19379e1f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecastHour);
}

function formatHour(timestamp) {
  let time = new Date(timestamp * 1000);
  let hour = time.getHours();
  if (hour < 10) {
    return `0${hour}`;
  } else {
    return hour;
  }
}

function showForecastHour(response) {
  let htmlElement = document.querySelector("#hourly");
  let addHtml = `<div class="row cur-day">`;
  let hours = response.data.hourly;
  hours.forEach(function (hourForecast, index) {
    if (index < 7) {
      addHtml =
        addHtml +
        ` <div class="col text-center">
                <p class="hour">${formatHour(hourForecast.dt)}:00</p>
                <img
                  src="./img/${hourForecast.weather[0].icon}.svg"
                  alt="weater"
                  width="50px"
                  class="day-sign"
                  id="day-sign"
                />
                <p class="cur-day-temp">${Math.round(hourForecast.temp)}°</p>
              </div>`;
    }
  });
  addHtml = addHtml + ` </div>`;
  htmlElement.innerHTML = addHtml;
}

function callForecastDays(coordinates) {
  let apiKey = `b95e4d9ece25e5d23a804d0d19379e1f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecastDays);
}

function formatDay(timestamp) {
  let time = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[time.getDay()];
  return day;
}

function showForecastDays(response) {
  let htmlElement = document.querySelector("#weekly");
  let addHtml = `<div class="row five-days">`;
  let days = response.data.daily;
  days.forEach(function (dayForecast, index) {
    if (index < 5) {
      addHtml =
        addHtml +
        `<div class="col text-center">
                <p class="day">${formatDay(dayForecast.dt)}</p>
                <img
                  src="./img/${dayForecast.weather[0].icon}.svg"
                  alt="weater"
                  width="50px"
                  class="day-sign"
                  id="day-sign"
                />
                <p class="day-temp">
                  <span class="day-temp-min">${Math.round(
                    dayForecast.temp.min
                  )}°</span><span class="day-temp-max"> ${Math.round(
          dayForecast.temp.max
        )}°</span>
                </p>
              </div>`;
    }
  });
  addHtml = addHtml + `</div>`;
  htmlElement.innerHTML = addHtml;
}

function showTemp(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src", `./img/${response.data.weather[0].icon}.svg`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  callForecastDays(response.data.coord);
  callForecastHour(response.data.coord);
}

function search(city) {
  let apiKey = "b95e4d9ece25e5d23a804d0d19379e1f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function showFahTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "b95e4d9ece25e5d23a804d0d19379e1f";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let button = document.querySelector("#btn-current");
button.addEventListener("click", getCurrentPosition);

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelTemp);

search("Rome");
