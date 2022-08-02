// API keys
const API_KEY = process.env.REACT_APP_GOOGLE_PLACES;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER;

export const KEYS = {
  API_KEY,
  WEATHER_API_KEY,
};

export function transformUnit(type, baseUnit, newUnit) {
  let result = "";

  if (type === "temperature") {
    switch (newUnit) {
      case "Celcius":
        result = Math.round(baseUnit - 273.15) + "°C";
        break;

      case "Farenheit":
        result = Math.round(1.8 * (baseUnit - 273) + 32) + "°F";
        break;

      default:
        result = Math.round(baseUnit) + "°K";
        break;
    }
  } else if (type === "speed") {
    switch (newUnit) {
      case "m/s":
        result = Math.round(baseUnit * 3.6) + "km/h";
        break;

      default:
        result = Math.round(baseUnit * 2.237) + "mph";
        break;
    }
  } else if (type === "pressure") {
    switch (newUnit) {
      case "mBar":
        result = Math.round(baseUnit / 1000) + " mBar";
        break;

      case "psi":
        result = Math.round(baseUnit * 0.0145037738) + " psi";
        break;

      default:
        result = Math.round(baseUnit / 10) + "kPa";
        break;
    }
  }

  return result;
}

export function getLocationAsText(
  lat,
  long,
  cityOnly = false,
  destructured = false
) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((places) => {
      let indexes = [3, 4];

      if (!places.results[0].address_components[3]) {
        indexes = [1, 2];
      } else if (!places.results[0].address_components[4]) {
        indexes = [2, 3];
      }

      let address_str = `${
        places.results[0].address_components[indexes[0]].long_name
      }, ${places.results[0].address_components[indexes[1]].long_name}`;
      let pieces = [
        places.results[0].address_components[indexes[0]].long_name,
        places.results[0].address_components[indexes[1]].long_name,
      ];
      if (!destructured) {
        return cityOnly
          ? places.results[0].address_components[indexes[0]].long_name
          : address_str;
      } else {
        return pieces;
      }
    });
}

export function fetchWeather(lat, long) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`
  )
    .then((resp) => resp.json())
    .then((res) => {
      return res;
    });
}

export function formatAMPM(date, postfix = true) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return postfix ? strTime : hours;
}
