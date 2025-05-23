import "./styles.css";
import cross from "./images/cross.png";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const imgSrc = {
  "clear-day": "clear-day.svg",
  "clear-night": "clear-night.svg",
  "partly-cloudy-day": "partly-cloudy-day.svg",
  "partly-cloudy-night": "partly-cloudy-night.svg",
  "mostly-cloudy-day": "partly-cloudy-day.svg",
  "mostly-cloudy-night": "partly-cloudy-day.svg",
  cloudy: "cloudy.svg",
  rain: "rain.svg",
  "light-rain": "rain.svg",
  "showers-day": "showers-day.svg",
  "showers-night": "showers-night.svg",
  thunderstorm: "thunderstorm.svg",
  "t-storm": "thunderstorm.svg",
  snow: "snow.svg",
  "light-snow": "snow.svg",
  flurries: "snow.svg",
  "snow-showers-day": "snow-showers-day.svg",
  "snow-showers-night": "snow-showers-night.svg",
  fog: "fog.svg",
  haze: "fog.svg",
  wind: "wind.svg",
  sleet: "snow.svg",
  "freezing-rain": "snow.svg",
  "wintry-mix": "snow.svg",
  default: "cross.png",
};

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=DSG3LLP4A2J4WGR2DEJQNFNZ2&lang=en&unitGroup=metric`,
      { mode: "cors" },
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = getWeatherObject(await response.json());
    console.log(data);
    loadWeatherPage(data);
  } catch (error) {
    loadErrorPage(error.message);
  }
}

function getWeatherObject(data) {
  console.log(data);
  return {
    currentConditions: data.currentConditions,
    days: data.days,
    description: data.description,
    resolvedAddress: data.resolvedAddress,
  };
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const inputText = document.querySelector("form input").value;
  getWeatherData(inputText);
});

function loadWeatherPage(data) {
  const content = document.querySelector("#content");
  content.innerHTML = "";

  const weatherDiv = document.createElement("div");
  weatherDiv.classList.add("weather-data");

  const address = document.createElement("h2");
  address.textContent = data.resolvedAddress;

  weatherDiv.appendChild(address);
  weatherDiv.appendChild(loadCurrentWeather(data));
  weatherDiv.appendChild(loadForecast(data));

  content.appendChild(weatherDiv);
}

function loadCurrentWeather(data) {
  const currentDiv = document.createElement("div");
  currentDiv.classList.add("current-data");

  const descDiv = document.createElement("div");
  descDiv.classList.add("description");

  const img = document.createElement("img");
  const iconName = imgSrc[data.currentConditions.icon] || "default";

  import(`./images/${iconName}`)
    .then((module) => {
      img.src = module.default;
    })
    .catch(() => {
      img.src = cross;
    });

  const desc = document.createElement("span");
  desc.textContent = data.currentConditions.conditions;

  descDiv.appendChild(img);
  descDiv.appendChild(desc);

  const temperatureDiv = document.createElement("div");
  temperatureDiv.classList.add("temperature");

  const temperature = document.createElement("span");
  temperature.innerHTML = data.currentConditions.temp + ` <sup>o</sup>C`;

  temperatureDiv.appendChild(temperature);

  const extraDetailsDiv = document.createElement("div");
  extraDetailsDiv.classList.add("extra-details");

  extraDetailsDiv.appendChild(
    createDetail(
      "Feels like:",
      data.currentConditions.feelslike,
      `<sup>o</sup> C`,
    ),
  );
  extraDetailsDiv.appendChild(document.createElement("hr"));
  extraDetailsDiv.appendChild(
    createDetail("Humidity:", data.currentConditions.humidity, `%`),
  );
  extraDetailsDiv.appendChild(document.createElement("hr"));
  extraDetailsDiv.appendChild(
    createDetail("Precipitation:", data.currentConditions.precipprob, `%`),
  );
  extraDetailsDiv.appendChild(document.createElement("hr"));
  extraDetailsDiv.appendChild(
    createDetail("Wind Speed:", data.currentConditions.windspeed, ` km/h`),
  );
  extraDetailsDiv.appendChild(document.createElement("hr"));

  currentDiv.appendChild(descDiv);
  currentDiv.appendChild(temperatureDiv);
  currentDiv.appendChild(extraDetailsDiv);

  return currentDiv;
}

function loadForecast(data) {
  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("next-data");
  for (let i = 0; i < 5; i++) {
    forecastDiv.appendChild(createForecastCard(data, i + 1));
  }

  return forecastDiv;
}

function createForecastCard(data, index) {
  const day = data.days[index];
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("day");

  let indexDate = new Date(day.datetime);
  const dayHeading = document.createElement("span");
  dayHeading.textContent = days[indexDate.getDay()];

  const img = document.createElement("img");
  const iconName = imgSrc[data.currentConditions.icon] || "default";

  import(`./images/${iconName}`)
    .then((module) => {
      img.src = module.default;
    })
    .catch(() => {
      img.src = cross;
    });

  const temperatureHeading = document.createElement("span");
  temperatureHeading.innerHTML = `${day.temp}<sup>o</sup> C`;

  cardDiv.appendChild(dayHeading);
  cardDiv.appendChild(img);
  cardDiv.appendChild(temperatureHeading);

  return cardDiv;
}

function createDetail(heading, data, units) {
  const detail = document.createElement("div");
  detail.classList.add("detail");

  const strongText = document.createElement("strong");
  strongText.textContent = heading;
  const headingSpan = document.createElement("span");
  headingSpan.appendChild(strongText);

  const dataSpan = document.createElement("span");
  dataSpan.innerHTML = data + units;

  detail.appendChild(headingSpan);
  detail.appendChild(dataSpan);

  return detail;
}

function loadErrorPage(error) {
  const content = document.querySelector("#content");
  content.innerHTML = "";

  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error");

  const img = document.createElement("img");
  img.src = cross;

  const errorText = document.createElement("span");
  if (error == "400") {
    errorText.textContent = "The Weather Data For Location Does Not Exist!";
  } else if (error == "0") {
    errorText.textContent = "Cannot Establish Connection To API!";
  } else {
    errorText.textContent = "Unknown Error!";
  }

  errorDiv.appendChild(img);
  errorDiv.appendChild(errorText);

  content.appendChild(errorDiv);
}
