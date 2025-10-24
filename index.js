const apiKey = "511c13c381c48c1baacda44cc9a3292c";
const wheatherForm = document.querySelector(".wheatherForm");
const cityInput = document.querySelector(".inputDisplay");
const card = document.querySelector(".card");

wheatherForm.addEventListener("keypress", (event) => {
  // console.log(event);
  if (KeyboardEvent === "Enter") {
    wheatherForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const city = cityInput.value;
      if (city) {
        try {
          const wheatherData = await getWheatherData(city);
          wheatherInfo(wheatherData);
        } catch (error) {
          console.error(error);
          displayError(error);
        }
      } else {
        displayError("please enter an city");
      }
    });
  }
});

wheatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const wheatherData = await getWheatherData(city);
      wheatherInfo(wheatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("please enter an city");
  }
});

async function getWheatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("could not fetch data");
  }
  return response.json();
}

function wheatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
    wind: { deg, gust, speed },
  } = data;
  console.log(data);
  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const stateDisplay = document.createElement("p");
  const emojiDisplay = document.createElement("p");
  const windDisplayDeg = document.createElement("p");
  const windDisplayGust = document.createElement("p");
  const windDisplaySpeed = document.createElement("p");

  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");

  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}℃`;
  tempDisplay.classList.add("tempDisplay");

  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");

  stateDisplay.textContent = `${description}`;
  stateDisplay.classList.add("stateDisplay");

  emojiDisplay.textContent = WeatherEmoji(id);
  emojiDisplay.classList.add("emojiDisplay");

  function getWindDirection(deg) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }
  windDisplayDeg.textContent = ` WIND:-
   deg: ${data.wind.deg}° (${getWindDirection(data.wind.deg)})`;

  const gustKmh = (data.wind.gust * 3.6).toFixed(1);
  windDisplayGust.textContent = `Gust: ${data.wind.gust} &&  ${gustKmh} km/h`;
  windDisplaySpeed.textContent = `speed:${speed} m/s`;

  windDisplayDeg.classList.add("stateDisplay");
  windDisplayGust.classList.add("stateDisplay");
  windDisplaySpeed.classList.add("stateDisplay");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(stateDisplay);
  card.appendChild(emojiDisplay);
  card.appendChild(windDisplayDeg);
  card.appendChild(windDisplayGust);
  card.appendChild(windDisplaySpeed);
}

function WeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️"; // Thunderstorm
    case weatherId >= 300 && weatherId < 400:
      return "🌦️"; // Drizzle
    case weatherId >= 500 && weatherId < 600:
      return "🌧️"; // Rain
    case weatherId >= 600 && weatherId < 700:
      return "❄️"; // Snow
    case weatherId >= 700 && weatherId < 800:
      return "🌫️"; // Mist, fog, smoke, dust
    case weatherId === 800:
      return "☀️"; // Clear sky
    case weatherId > 800 && weatherId < 810:
      return "☁️"; // Cloudy
    default:
      return "❓"; // Unknown condition
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
