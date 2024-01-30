// hide cards until new search
$(".weather").css("display", "none");

// click event for weather info
$("#search-button").on("click", getWeather);

// main function for gathering weather data and displaying to html
function getWeather(event) {
  event.preventDefault();

  // grab user input
  var userInput = $("#search-input").val().trim();

  // prepend search to history section
  var btnEl = $("<button>");
  btnEl.text(userInput);
  $("#history").prepend(btnEl);

  // function called to save search to local storage
  saveUerInput();

  // grab api for weather data
  const weatherApiKey = "700c1c890919726aec2084f550e46b49";
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + weatherApiKey + "&units=metric";

  // check api response
  fetch(weatherUrl)
    .then(function (response) {
      if (response.status === 404 || response.status === 400) {
        $(".error").css("display", "block");
      } else {
        $(".error").css("display", "none");
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
            date = dt_txt.split(" ");
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
                <p class="card-title text-center">${date[0]}</p>
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

// save user input to local storage
function saveTolocalStorage(key, value) {
  let existingData = JSON.parse(localStorage.getItem(key)) || [];

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
  console.log(storedResults);
  if (storedResults !== null) {
    var items = JSON.parse(storedResults);
  }
  displayLocationHistory(items);
}

function displayLocationHistory(items) {
  items.forEach(function (item) {
    var btnEl = $("<button>");
    btnEl.text(item);
    $("#history").prepend(btnEl);
  });
}
getHistory();
