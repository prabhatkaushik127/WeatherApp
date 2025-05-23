async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const useF = document.getElementById("unitToggle").checked;
  const apiKey = "API";
  const unit = useF ? "f" : "c";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;

  if (!city) {
    document.getElementById("currentWeather").innerHTML = "<p>Please enter a city name.</p>";
    document.getElementById("forecast").innerHTML = "";
    return;
  }

  document.getElementById("loadingSpinner").classList.remove("hidden");
  document.getElementById("currentWeather").innerHTML = "";
  document.getElementById("forecast").innerHTML = "";

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("loadingSpinner").classList.add("hidden");

    if (res.ok && data.current) {
      const curr = data.current;
      const forecast = data.forecast.forecastday;

      const currentHTML = `
        <h3>${data.location.name}, ${data.location.country}</h3>
        <img class="weather-icon" src="${curr.condition.icon}" alt="icon" />
        <p>${curr.condition.text}</p>
        <p>${unit === "f" ? curr.temp_f : curr.temp_c}°${unit.toUpperCase()} | Feels like: ${unit === "f" ? curr.feelslike_f : curr.feelslike_c}°</p>
        <p>Humidity: ${curr.humidity}% | Wind: ${unit === "f" ? curr.wind_mph + " mph" : curr.wind_kph + " kph"}</p>
      `;

      let forecastHTML = `<h4>5-Day Forecast</h4>`;
      forecast.forEach(day => {
        forecastHTML += `
          <div>
            ${day.date.slice(5)}:
            <img class="weather-icon" src="${day.day.condition.icon}" alt="icon" />
            ${unit === "f" ? day.day.avgtemp_f : day.day.avgtemp_c}°
          </div>
        `;
      });

      document.getElementById("currentWeather").innerHTML = currentHTML;
      document.getElementById("forecast").innerHTML = forecastHTML;
    } else {
      document.getElementById("currentWeather").innerHTML = `<p>${data.error?.message || "City not found."}</p>`;
    }
  } catch (error) {
    document.getElementById("loadingSpinner").classList.add("hidden");
    document.getElementById("currentWeather").innerHTML = "<p>Error loading data.</p>";
  }
}
