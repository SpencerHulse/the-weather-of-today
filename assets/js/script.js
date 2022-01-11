//save data
let searchedCities = [];

//one call api key
let oneCallApiKey = "c271cbbc5f9e0287d1957ce5750e8ccf";

//variables
let currentCity = "Chattanooga";
let date = luxon.DateTime.local();
//form
let formInputEl = $("#city-input");
let searchBtnEl = $("#search-button");
//current weather
let currentWeatherEl = $("#current-weather");
let currentWeatherContainerEl = $("#current-weather-container");
//forecast
let forecastContainerEl = $("#forecast-container");

//handles getting the entered city
let citySearchHandler = (event) => {
  //prevent page from reloading
  event.preventDefault();
  //get typed-in city
  let city = formInputEl.val();
  //sets current city for dashboard
  currentCity = city;
  //reset form
  formInputEl.val("");
  //updates the search history
  searchHistoryHandler(city);
  //send a request for city geolocation data
  fetchCityGeolocation(city);
};

//keeps an array of the past 8 searches
let searchHistoryHandler = (city) => {
  searchedCities.unshift(city);
  searchedCities = searchedCities.slice(0, 8);
};

let fetchCityGeolocation = (city) => {
  let geolocationApi =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    oneCallApiKey;

  fetch(geolocationApi).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        let longitude = data[0].lon;
        let latitude = data[0].lat;
        fetchCityWeather(latitude, longitude);
      });
    } else {
      alert("City not found");
    }
  });
};

let fetchCityWeather = (cityLat, cityLon) => {
  let lat = cityLat;
  let lon = cityLon;
  let oneCallWeatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    "&appid=" +
    oneCallApiKey;

  fetch(oneCallWeatherApi).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        createWeatherPanel(data);
      });
    }
  });
};

let createWeatherPanel = (cityData) => {
  //get the date and convert it to month/day/year format
  let currentDate = date.month + "/" + date.day + "/" + date.year;
  //create current weather dashboard
  currentWeatherContainerEl.append(
    "<h2>" + currentCity + " (" + date.toLocaleString() + ")" + "</h2>"
  );
  currentWeatherContainerEl.append(
    "<img src='http://openweathermap.org/img/wn/" +
      cityData.current.weather[0].icon +
      "@2x.png' />"
  );
  currentWeatherEl.append("<p>Temp: " + cityData.current.temp + "&#176;F");
  currentWeatherEl.append("<p>Wind: " + cityData.current.wind_speed + " MPH");
  currentWeatherEl.append("<p>Humidity: " + cityData.current.humidity + " %");
  currentWeatherEl.append("<p>UV Index: " + cityData.current.uvi);
  console.log(cityData);

  //five day forecast
  for (let i = 1; i <= 5; i++) {
    let dayContainerEl = $("<div class='forecast-day'></div>");
    dayContainerEl.append("<h4>" + date.plus({ day: i }).toLocaleString()) +
      "</h4>";
    dayContainerEl.append(
      "<img src='http://openweathermap.org/img/wn/" +
        cityData.daily[i].weather[0].icon +
        "@2x.png' />"
    );
    dayContainerEl.append(
      "<p>Max Temp: " + cityData.daily[i].temp.max + "&#176;F</p>"
    );
    dayContainerEl.append(
      "<p>Min Temp: " + cityData.daily[i].temp.min + "&#176;F</p>"
    );
    dayContainerEl.append(
      "<p>Wind: " + cityData.daily[i].wind_speed + " MPH</p>"
    );
    dayContainerEl.append(
      "<p>Humidity: " + cityData.daily[i].humidity + " %</p>"
    );
    forecastContainerEl.append(dayContainerEl);
  }
};

//event handlers
searchBtnEl.on("click", citySearchHandler);
fetchCityGeolocation("Chattanooga");
