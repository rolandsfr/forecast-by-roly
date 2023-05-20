import { useState, useEffect, useContext } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

// styles
import "./Location.scss";

// images
import moon from "../../img/moon.png";

// components
import Setting from "../Setting/Setting.jsx";
import WeatherBar from "../weatherBar/WeatherBar";
import Preloader from "../Preloader/Preloader";
import NavContext from "../Context/NavContext";

// custom modules
import {
  transformUnit,
  getLocationAsText,
  fetchWeather,
} from "../../modules/utilities";

let auth = true;

export default function Location(props) {
  // states
  const [location, setLocation] = useState("Fetching your location");
  const [weather, setWeather] = useState({
    temperature: 0,
    wind: 0,
    humidity: 0,
    pressure: 0,
    state: "Fetching...",
  });
  const [loaded, setloaded] = useState(false);

  let initialSettings = JSON.parse(localStorage.getItem("settings"));
  if (!initialSettings)
    localStorage.setItem(
      "settings",
      JSON.stringify({ temperature: "Celcius", speed: "m/s", pressure: "mBar" })
    );

  let settings = initialSettings || {
    temperature: "Celcius",
    speed: "m/s",
    pressure: "mBar",
  };
  const [weatherObj, setWeatherObj] = useState(null);

  const setNav = useContext(NavContext);

  // gather new unit from daughter component and reset it
  function setWeatherPieces(piece) {
    settings[piece.type] = piece.unit;
    localStorage.setItem("settings", JSON.stringify(settings));
    updateWeather(weatherObj);
  }

  useEffect(() => {
    getLocation(getCoords);
    auth = true;
    props.getData(settings);
    setloaded(true);
  }, []);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoords);
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  function updateWeather(weather) {
    setWeatherObj(weather);

    // set the right units
    let temperature = transformUnit(
      "temperature",
      weather.main.feels_like,
      settings.temperature
    );

    let wind = transformUnit("speed", weather.wind.speed, settings.speed);
    let pressure = transformUnit(
      "pressure",
      weather.main.pressure,
      settings.pressure
    );

    // rerender weather units
    setWeather({
      wind,
      temperature,
      humidity: weather.main.humidity,
      pressure,
      state:
        weather.weather[0].description[0].toUpperCase() +
        weather.weather[0].description.slice(1),
    });
  }

  async function getCoords(pos) {
    let { latitude, longitude } = pos.coords;
    return getLocationAsText(latitude, longitude).then((res) => {
      setLocation(res);

      if (auth) {
        auth = false;

        return fetchWeather(latitude, longitude).then((weather) => {
          updateWeather(weather);
        });
      }

      return res;
    });
  }

  return (
    <div className="container" id="wrapper">
      <div className="location-info">
        <div className="subheading">
          <FontAwesomeIcon icon={faLocationArrow} />
          <p>Your location now</p>
        </div>
        <h2 className="location">{location}</h2>
        <img src={moon} alt="moon" />
        <p className="lightning">{weather.state}</p>
        <p className="temperature">{weather.temperature}</p>

        <WeatherBar weather={weather} />

        <div className="settings">
          <Setting
            name="Temeperature"
            type="temperature"
            units={["Celcius", "Fahrenheit", "Kelvin"]}
            setWeatherPieces={setWeatherPieces}
            active={settings.temperature}
          />
          <Setting
            name="Wind speed"
            type="speed"
            units={["m/s", "mph"]}
            setWeatherPieces={setWeatherPieces}
            active={settings.speed}
          />
          <Setting
            name="Pressure"
            type="pressure"
            units={["mBar", "psi", "kPa"]}
            setWeatherPieces={setWeatherPieces}
            active={settings.pressure}
          />
        </div>
      </div>

      <Preloader loaded={loaded} />
    </div>
  );
}
