var cityName = "leeds";
// get api
const weatherApiKey = "700c1c890919726aec2084f550e46b49";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherApiKey + "&units=metric";

fetch(weatherUrl)
  .then(function (response) {
    if (response.status === 404) {
      $(".error").css("display", "block");
      $(".weather").css("display", "none");
    }

    return response.json();
  })
  .then(function (data) {
    console.log(data);

    $(".search-button").on("click", function (event) {
      event.preventDefault();
      console.log("clock");
    });
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
  });
