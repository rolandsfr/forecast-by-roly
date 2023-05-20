// custom modules
import { useEffect, useState, useContext } from "react";
import {
  transformUnit,
  getLocationAsText,
  fetchWeather,
  formatAMPM,
  KEYS,
} from "../../modules/utilities";
import ScrollMenu from "react-horizontal-scrolling-menu";

// components
import WeatherBar from "../weatherBar/WeatherBar";
import Canvas from "../Canvas/Canvas";
import Preloader from "../Preloader/Preloader";
import NavContext from "../Context/NavContext";

// images
import moon from "../../img/moon.png";
import sunrise from "../../img/sunrise.png";
import sunset from "../../img/sunset.png";

// styles
import "./Home.scss";

export default function Home(props) {
  const [location, setLocation] = useState("Fetching your location");
  const [weather, setWeather] = useState({
    temperature: 0,
    wind: 0,
    humidity: 0,
    pressure: 0,
  });
  const [sunTime, setSunTime] = useState({ sunrise: 0, sunset: 0 });
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(0);
  const [dailyForecast, setDailyForecast] = useState(0);
  const [loaded, setloaded] = useState(false);

  const setNav = useContext(NavContext);

  const abortController = new AbortController();
  const signal = abortController.signal;

  let settings = JSON.parse(localStorage.getItem("settings")) || {
    temperature: "Celcius",
    speed: "m/s",
    pressure: "mBar",
  };

  useEffect(() => {
    getLocation(getCoords);
    props.returnDate(settings);
    setNav(props.location.pathname);

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(async () => {
    returnHourlyForecast(forecast);
    returnDailyForecast(forecast);
  }, [forecast]);

  function fetchForecast(lat, long) {
    if (!signal.aborted) {
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?&exclude=minutely,current&lat=${lat}&lon=${long}&appid=${KEYS.WEATHER_API_KEY}`
      )
        .then((resp) => resp.json())
        .then((res) => {
          console.log(res);
          setForecast(res);
        });
    } else {
      console.log("nope");
    }
  }

  function getLocation() {
    if (navigator.geolocation) {
      console.log("???");
      navigator.geolocation.getCurrentPosition(getCoords);
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  function returnHourlyForecast(forecast) {
    let elements = [];

    if (forecast) {
      for (let i = 0; i <= 12; i++) {
        let hour = formatAMPM(new Date(forecast.hourly[i].dt * 1000));
        let temperature = transformUnit(
          "temperature",
          forecast.hourly[i].feels_like,
          settings.temperature
        ).replace(/[a-zA-Z]/g, "");

        elements.push(
          <div className="hourly" key={i}>
            <span className="hour">{hour}</span>
            <i className={`wi wi-owm-${forecast.hourly[i].weather[0].id}`}></i>
            <span className="hour-temperature">{temperature}</span>
          </div>
        );
      }
    } else {
      elements = null;
    }

    setHourlyForecast(elements);
  }

  function returnDailyForecast(forecast) {
    let elements = [];
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (forecast) {
      for (let i = 0; i <= 7; i++) {
        let wkday = days[new Date(forecast.daily[i].dt * 1000).getDay()];
        let dayTemperature = transformUnit(
          "temperature",
          forecast.daily[i].feels_like.day,
          settings.temperature
        ).replace(/[a-zA-Z]/g, "");
        let nightTemperature = transformUnit(
          "temperature",
          forecast.daily[i].feels_like.night,
          settings.temperature
        ).replace(/[a-zA-Z]/g, "");

        elements.push(
          <div className="daily" key={i}>
            <div className="day">
              <i className={`wi wi-owm-${forecast.daily[i].weather[0].id}`}></i>
              <span className="wkday">{wkday}</span>
            </div>

            <div className="temperatures">
              <span className="day-temperature">{dayTemperature}</span>
              <span className="night-temperature">{nightTemperature}</span>
            </div>
          </div>
        );
      }
    } else {
      elements = null;
    }

    setDailyForecast(elements);
  }

  function getCoords(pos) {
    let { latitude, longitude } = pos.coords;
    console.log(pos);
    getLocationAsText(latitude, longitude, true).then((res) => {
      setLocation(res);

      const weatherPromise = fetchWeather(latitude, longitude).then(
        (weather) => {
          //TODO: await
          // set the right units
          let temperature = transformUnit(
            "temperature",
            weather.main.feels_like,
            settings.temperature
          ).replace(/[a-zA-Z]/g, "");
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

          setSunTime({
            sunrise: formatAMPM(new Date(weather.sys.sunrise * 1000)),
            sunset: formatAMPM(new Date(weather.sys.sunset * 1000)),
          });
        }
      );

      const forecastPromise = fetchForecast(latitude, longitude);

      Promise.all([weatherPromise, forecastPromise]).then(() => {
        setloaded(true);
      });
    });
  }

  return (
    <div id="wrapper">
      <img src={moon} className="weather-illustration" alt="" />
      <div className="main">
        <div className="container">
          <div className="city">{location}</div>
          <h2 className="temperature-main">{weather.temperature}</h2>
          <p className="description">{weather.state}</p>
          <WeatherBar alignment="space-between" weather={weather} />
        </div>
      </div>

      <div className="sunTime">
        <div className="container">
          <div className="container__inner">
            <div className="sunrise">
              <img src={sunrise} alt="" />
              <span className="timestamp">{sunTime.sunrise}</span>
            </div>

            <div className="sunset">
              <span className="timestamp">{sunTime.sunset}</span>
              <img src={sunset} alt="" />
            </div>
          </div>
        </div>
        <Canvas time={sunTime} height={100} />
      </div>

      <div className="forecast">
        <div className="container">
          <h3>Today</h3>
        </div>

        <div className="hourly-forecast">
          {forecast ? (
            <ScrollMenu
              translate={35}
              wheel={false}
              inertiaScrolling={true}
              inertiaScrollingSlowdown={0.7}
              data={hourlyForecast}
            />
          ) : (
            "Loading.."
          )}
        </div>

        <div className="daily-forecast">
          <div className="container">{dailyForecast}</div>
        </div>
      </div>

      <Preloader loaded={loaded} />
    </div>
  );
}
