//save data
let searchedCities = [];

//element variables
let formInputEl = $("#city-input");
let searchBtnEl = $("#search-button");

//handles getting the entered city
let citySearchHandler = (event) => {
  //prevent page from reloading
  event.preventDefault();
  //get typed-in city
  let city = formInputEl.val();
  //reset form
  formInputEl.val("");
  console.log(city);
  searchHistoryHandler(city);
};

//keeps an array of the past 8 searches
let searchHistoryHandler = (city) => {
  searchedCities.unshift(city);
  searchedCities = searchedCities.slice(0, 8);
  console.log(searchedCities);
};

//event handlers
searchBtnEl.on("click", citySearchHandler);
