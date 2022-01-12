# the-weather-of-today

## Description

This weather dashboard utilizes HTML, CSS, JS, jQuery, and Bootstrap. For weather data, it utilizes geolocation and One Call Api from OpenWeather.

There is a form to search a city name on the page. It gets the geolocation of the city, returning an alert if a city is not found or the request fails. If it succeeds, the city latitude and longitude is used to fetch weather data, which is then displayed on the page.

The page displays the current weather data and the weather for the next five days, which is all created dynamically.

There is a search history under the form that holds the past eight searches. If clicked, that city's information is displayed on the page, and it is put as the newest search on the search history.

The page responds dynamically to look good and function on various screen sizes. On screens smaller than large (based on Bootstrap), the search history is hidden, and the structure of the page adjusts.

The search history is saved and loaded from local storage. On a new visit, a blank current weather display is shown. Otherwise, the last search is pulled up automatically.

![alt text](./assets/images/screenshot.png)

It is deployed at: https://spencerhulse.github.io/the-weather-of-today/
