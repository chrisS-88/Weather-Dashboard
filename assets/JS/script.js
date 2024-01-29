// $(".weather").css("display", "none");

$("#search-button").on("click", getWeather);

function getWeather(event) {
  event.preventDefault();
  // grab user input
  var userInput = $("#search-input").val().trim();

  // prepend search to history section
  var btnEl = $("<button>");
  btnEl.text(userInput);
  $("#history").prepend(btnEl);

  // save search to local storage
  saveUerInput();

  // grab api for weather data
  const weatherApiKey = "700c1c890919726aec2084f550e46b49";
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + weatherApiKey + "&units=metric";

  fetch(weatherUrl)
    .then(function (response) {
      if (response.status === 404 || response.status === 400) {
        $(".error").css("display", "block");
        // $(".weather").css("display", "none");
      } else {
        $(".error").css("display", "none");
        return response.json();
      }
    })
    .then(function (data) {
      // console.log(data);

      //current weather display elements
      var cityEl = $("#location");
      var dateEl = $("#current-date");
      var tempEl = $("#temp");
      var windSpeedEl = $("#wind-speed");
      var humidityEl = $("#humidity");

      // target display with data
      cityEl.text(data.name);
      dateEl.text(dayjs().format("DD/MM/YYYY"));
      tempEl.text(parseInt(data.main.temp) + " °c");
      windSpeedEl.text("Wind Speed: " + data.wind.speed + " m/s");
      humidityEl.text("Humidity: " + data.main.humidity + "%");

      // change image to display current weather
      var weatherIcon = $(".current-weather-icon");

      if (data.weather[0].main == "Clear") {
        weatherIcon.attr("src", "assets/images/clear.png");
      } else if (data.weather[0].main == "Rain") {
        weatherIcon.attr("src", "assets/images/rain.png");
      } else if (data.weather[0].main == "Clouds") {
        weatherIcon.attr("src", "assets/images/clouds.png");
      } else if (data.weather[0].main == "Mist") {
        weatherIcon.attr("src", "assets/images/mist.png");
      } else if (data.weather[0].main == "Snow") {
        weatherIcon.attr("src", "assets/images/snow.png");
      } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.attr("src", "assets/images/drizzle.png");
      }

      $(".weather").css("display", "block");

      // 5 day forecast
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
          // console.log(data);
          var forcastList = data.list;

          for (let i = 0; i < forcastList.length; i += 8) {
            var { dt_txt, weather, main, wind, humidity } = forcastList[i];
            date = dt_txt.split(" ");
            var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

            temp = parseInt(main.temp);
            wind = wind.speed;
            humidity = main.humidity;

            forecastEl.append(`
            <div class="col-md-2 col-lg-2 mx-auto card mb-3">
              <div class="text-start card-body p-2">
                <h5 class="card-title">${date[0]}</h5>
                <img class="card-text" src=${iconUrl} > 
                <p class="card-text">Temp: ${temp} °c</p>
                <p class="card-text">Wind: ${wind} m/s</p>
                <p class="card-text">Humidity: ${humidity} %</p>
              </div>
            `);
          }
        });
    });
}

// functions to save user input to local storage
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
