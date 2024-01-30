// hide cards until new search
$(".weather").css("display", "none");

// initialise empty array for existing data
let existingData = [];

// click event for weather info and clear history
$("#search-button").on("click", getWeather);
$("#clear-button").on("click", clearHistory);
// main function for gathering weather data and displaying to html
function getWeather(event) {
  event.preventDefault();

  // grab user input
  var userInput = $("#search-input").val().trim();

  // function called to save search to local storage
  saveUerInput();

  // grab api for weather data
  const weatherApiKey = "700c1c890919726aec2084f550e46b49";
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + weatherApiKey + "&units=metric";

  // check api response
  fetch(weatherUrl)
    .then(function (response) {
      if (response.status === 404 || response.status === 400) {
        // display error message
        $(".error").css("display", "block");
      } else {
        // clear error message and prepend city to history tab
        $(".error").css("display", "none");

        var btnEl = $("<button>");
        btnEl.addClass("historyBtn");

        btnEl.text(userInput);
        $("#history").prepend(btnEl);
        // api response
        return response.json();
      }
    })
    .then(function (data) {
      //current weather display elements
      var cityEl = $("#location");
      var dateEl = $("#current-date");
      var tempEl = $("#temp");
      var windSpeedEl = $("#wind-speed");
      var humidityEl = $("#humidity");
      var weatherIconEl = $(".current-weather-icon");
      var description = $(".description");
      var { weather } = data;
      var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      // display to card
      cityEl.text(data.name);
      dateEl.text(dayjs().format("DD/MM/YYYY"));
      tempEl.text(parseInt(data.main.temp) + " °c");
      windSpeedEl.text("Wind Speed: " + data.wind.speed + " m/s");
      humidityEl.text("Humidity: " + data.main.humidity + "%");
      weatherIconEl.attr("src", iconUrl);
      description.text(data.weather[0].description);

      // unhide card after search
      $(".weather").css("display", "block");

      // ==============
      // grab api & set variables for 5 day forecast
      var forecastEl = $("#forecast");
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var forecast =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey + "&units=metric";

      fetch(forecast)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var forcastList = data.list;

          // loop through api data to get same time forcast over next 5 days
          for (let i = 7; i < forcastList.length; i += 8) {
            var { dt_txt, weather, main, wind, humidity } = forcastList[i];

            // get rid of time and reverse date
            var dateAndTime = dt_txt.split(" ");
            var date = dateAndTime[0];
            var dateToString = date.toString();
            var moddedDate = dateToString.replace(/-/g, "/");
            var dateArr = moddedDate.split("/");
            var reversedArr = dateArr.reverse();
            var reversedDate = reversedArr.join("/");

            var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

            // set variables to append
            temp = parseInt(main.temp);
            wind = wind.speed;
            humidity = main.humidity;
            description = weather[0].description;

            // append cards
            forecastEl.append(`
            <div class=" col-md-2 col-lg-2 mx-auto card forecast-card mb-3">
              <div class="text-start card-body p-2">
                <p class="card-title text-center">${reversedDate}</p>
                <img class="card-text" src=${iconUrl} > 
                <p class="card-text">${description}</p>
                <p class="card-text">Temp: ${temp} °c</p>
                <p class="card-text">Wind: ${wind} m/s</p>
                <p class="card-text">Humidity: ${humidity} %</p>
              </div>
            `);
          }
        });

      // empty previous search before appending new search
      forecastEl.empty();

      // empty user input feild
      $("#search-input").val("");
    });
}

// save user input to local storage
// let existingData = [];
function saveTolocalStorage(key, value) {
  if (existingData.indexOf(value) !== -1) {
    return;
  }
  existingData.push(value);
  localStorage.setItem(key, JSON.stringify(existingData));
}

function saveUerInput() {
  var userInput = $("#search-input").val().trim();

  if (userInput !== "") {
    saveTolocalStorage("location", userInput);
  }
}

// get history from local storage and display on refresh
function getHistory() {
  var storedResults = localStorage.getItem("location");
  if (storedResults) {
    existingData = JSON.parse(storedResults);
  }

  displayLocationHistory(existingData);
}

function displayLocationHistory(items) {
  items.forEach(function (item) {
    var btnEl = $("<button>");
    btnEl.addClass("historyBtn");
    btnEl.text(item);
    $("#history").prepend(btnEl);
  });
}

getHistory();

// clear local storage
function clearHistory() {
  localStorage.clear();
}

function historyWeather(city) {
  const weatherApiKey = "700c1c890919726aec2084f550e46b49";
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherApiKey + "&units=metric";

  // check api response
  fetch(weatherUrl)
    .then(function (response) {
      if (response.status === 404 || response.status === 400) {
        // display error message
        $(".error").css("display", "block");
      } else {
        // clear error message and prepend city to history tab
        $(".error").css("display", "none");
        // api response
        return response.json();
      }
    })
    .then(function (data) {
      //current weather display elements
      var cityEl = $("#location");
      var dateEl = $("#current-date");
      var tempEl = $("#temp");
      var windSpeedEl = $("#wind-speed");
      var humidityEl = $("#humidity");
      var weatherIconEl = $(".current-weather-icon");
      var description = $(".description");
      var { weather } = data;
      var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      // display to card
      cityEl.text(data.name);
      dateEl.text(dayjs().format("DD/MM/YYYY"));
      tempEl.text(parseInt(data.main.temp) + " °c");
      windSpeedEl.text("Wind Speed: " + data.wind.speed + " m/s");
      humidityEl.text("Humidity: " + data.main.humidity + "%");
      weatherIconEl.attr("src", iconUrl);
      description.text(data.weather[0].description);

      // unhide card after search
      $(".weather").css("display", "block");

      // ==============
      // grab api & set variables for 5 day forecast
      var forecastEl = $("#forecast");
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var forecast =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey + "&units=metric";

      fetch(forecast)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var forcastList = data.list;

          // loop through api data to get same time forcast over next 5 days
          for (let i = 7; i < forcastList.length; i += 8) {
            var { dt_txt, weather, main, wind, humidity } = forcastList[i];

            // get rid of time and reverse date
            var dateAndTime = dt_txt.split(" ");
            var date = dateAndTime[0];
            var dateToString = date.toString();
            var moddedDate = dateToString.replace(/-/g, "/");
            var dateArr = moddedDate.split("/");
            var reversedArr = dateArr.reverse();
            var reversedDate = reversedArr.join("/");

            var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

            // set variables to append
            temp = parseInt(main.temp);
            wind = wind.speed;
            humidity = main.humidity;
            description = weather[0].description;

            // append cards
            forecastEl.append(`
            <div class=" col-md-2 col-lg-2 mx-auto card forecast-card mb-3">
              <div class="text-start card-body p-2">
                <p class="card-title text-center">${reversedDate}</p>
                <img class="card-text" src=${iconUrl} > 
                <p class="card-text">${description}</p>
                <p class="card-text">Temp: ${temp} °c</p>
                <p class="card-text">Wind: ${wind} m/s</p>
                <p class="card-text">Humidity: ${humidity} %</p>
              </div>
            `);
          }
        });

      // empty previous search before appending new search
      forecastEl.empty();
    });
}

function searchClick(event) {
  var city = event.target.textContent;
  historyWeather(city);
}

$(".historyBtn").on("click", searchClick);
