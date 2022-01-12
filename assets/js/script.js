//save data
let searchedCities = [];

//one call api key
let oneCallApiKey = "c271cbbc5f9e0287d1957ce5750e8ccf";

//variables
let currentCity = "";
let date = luxon.DateTime.local();
//form
let formInputEl = $("#city-input");
let searchBtnEl = $("#search-button");
//search history
let searchHistoryEl = $("#search-history");
//current weather
let currentWeatherEl = $("#current-weather");
//forecast
let forecastContainerEl = $("#forecast-container");

//handles getting the entered city
let citySearchHandler = (event) => {
  //prevent page from reloading
  event.preventDefault();

  //get typed-in city
  let city = formInputEl.val();

  //assigning the city to a temp string
  let tempStr = city.slice();
  //creating an array with each word typed
  const tempArr = tempStr.split(" ");
  //loop to capitalize the first letter of each word
  for (let i = 0; i < tempArr.length; i++) {
    tempArr[i] = tempArr[i].charAt(0).toUpperCase() + tempArr[i].slice(1);
  }
  //returning the words in the array to a single string
  city = tempArr.join(" ");

  //sets current city for dashboard
  currentCity = city;
  //reset form
  formInputEl.val("");

  //updates the search history
  searchHistoryHandler(city);
  //send a request for city geolocation data
  fetchCityGeolocation(city);
};

let historicSearch = (event) => {
  let target = $(event.target);
  if (target.is("button")) {
    currentCity = target[0].innerText;
    searchHistoryHandler(currentCity);
    fetchCityGeolocation(currentCity);
  }
};

//keeps an array of the past 8 searches
let searchHistoryHandler = (city) => {
  searchedCities.unshift(city);
  searchedCities = searchedCities.slice(0, 8);
  saveSearchHistory();
  createSearchHistory();
};

//creates search history
//seperated from handler to load in without adding the last city to the list again
let createSearchHistory = () => {
  searchHistoryEl.empty();

  for (let i = 0; i < searchedCities.length; i++) {
    let cityButton = $(
      "<button class='btn btn-secondary'>" + searchedCities[i] + "</button>"
    );
    searchHistoryEl.append(cityButton);
  }
};

let fetchCityGeolocation = (city) => {
  let geolocationApi =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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
  //clear the current weather element
  currentWeatherEl.empty();

  //data for the current weather element
  let currentDate = " (" + date.toLocaleString() + ")";
  let currentIcon = cityData.current.weather[0].icon;
  let currentTemp = cityData.current.temp + "&#176;F";
  let currentWindSpeed = cityData.current.wind_speed + " MPH";
  let currentHumidity = cityData.current.humidity + " %";
  let currentUvi = cityData.current.uvi;
  //creates the container to allow header and image to be side-by-side
  let containerEl = $(
    "<div class='d-flex' id='current-weather-container'></div>"
  );

  //appends the h2 containing city and date to the container
  containerEl.append("<h2>" + currentCity + currentDate + "</h2>");
  //appends an image that matches the current weather to the container
  containerEl.append(
    "<img src='https://openweathermap.org/img/wn/" + currentIcon + "@2x.png' />"
  );
  //appends the container to the current weather div
  currentWeatherEl.append(containerEl);
  //appends the current weather data to the weather div
  currentWeatherEl.append("<p>Temp: " + currentTemp);
  currentWeatherEl.append("<p>Wind: " + currentWindSpeed);
  currentWeatherEl.append("<p>Humidity: " + currentHumidity);

  //assigns the class based on the uv index
  let indexSeverity = "";
  if (currentUvi <= 2.5) {
    indexSeverity = "bg-success";
  } else if (currentUvi <= 5.5) {
    indexSeverity = "bg-warning";
  } else {
    indexSeverity = "bg-danger";
  }
  //appends the uvi with the appropriate bg to the weather div
  currentWeatherEl.append(
    "<p>UV Index: " +
      `<span class="uvi badge ${indexSeverity}">` +
      currentUvi +
      "</span>"
  );

  //five day forecast
  //empties the element
  forecastContainerEl.empty();
  //for loop to add the next five days
  for (let i = 1; i <= 5; i++) {
    //creates the container
    let dayContainerEl = $("<div class='forecast-day'></div>");
    let forecastDate = date.plus({ day: i }).toLocaleString();
    let forecastIcon = cityData.daily[i].weather[0].icon;
    let forecastMaxTemp = cityData.daily[i].temp.max;
    let forecastMinTemp = cityData.daily[i].temp.min;
    let forecastWindSpeed = cityData.daily[i].wind_speed;
    let forecastHumidity = cityData.daily[i].humidity;

    //appending all of the data to each forecast day
    dayContainerEl.append("<h4>" + forecastDate + "</h4>");
    dayContainerEl.append(
      "<img src='https://openweathermap.org/img/wn/" +
        forecastIcon +
        "@2x.png' />"
    );
    dayContainerEl.append("<p>Max Temp: " + forecastMaxTemp + "&#176;F</p>");
    dayContainerEl.append("<p>Min Temp: " + forecastMinTemp + "&#176;F</p>");
    dayContainerEl.append("<p>Wind: " + forecastWindSpeed + " MPH</p>");
    dayContainerEl.append("<p>Humidity: " + forecastHumidity + " %</p>");

    //appending each day to the 5-day container
    forecastContainerEl.append(dayContainerEl);
  }
};

//saves the search history to local storage
let saveSearchHistory = () => {
  //turns the array into a string
  localStorage.setItem("history", JSON.stringify(searchedCities));
};

//loads the search history from local storage
let loadSearchHistory = () => {
  //returns the data from its stringified version
  searchedCities = JSON.parse(localStorage.getItem("history"));

  //if there is nothing in localstorage, it stops here
  if (!searchedCities) {
    //starts with a clean array
    searchedCities = [];
    return;
  }

  //takes the previously searched city and displays it on the page
  currentCity = searchedCities[0];
  fetchCityGeolocation(currentCity);
  createSearchHistory();
};

//event handlers
searchBtnEl.on("click", citySearchHandler);
searchHistoryEl.on("click", historicSearch);

//initial load from local storage
loadSearchHistory();
