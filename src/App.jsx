import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useState, useEffect } from "react";

// content components
import Home from "./components/Home/Home";
import Saved from "./components/Saved/Saved";
import Location from "./components/Location/Location";

// styles
import "./bootstrap-grid.min.css";
import "./reset.css";
import "./main.scss";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faHeart,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import NavContext from "./components/Context/NavContext";

export default function App(props) {
  const [data, setData] = useState(null);
  const [returnedData, setReturnedData] = useState(null);
  const [currentHref, setcurrentHref] = useState(null);
  const [description, setdescription] = useState("");
  const [locationIsOn, setLocationIsOn] = useState(null);

  function getData(data) {
    setData(data);
  }

  function returnDate(data) {
    setReturnedData(data);
  }

  useEffect(() => {
    switch (currentHref) {
      case "/home":
        setdescription(
          "Fetches unit settings from /location page as well as requests user location and sets the right units for the fetched hourly and daily forecast."
        );
        break;
      case "/saved":
        setdescription(
          "Uses Google places autocomplete library to conveniently add locations. Coordinates of each one of those are stored in LocalStorage."
        );
        break;

      case "/location":
        setdescription(
          "Displays user location, basic weather information and allows to set units that are convenient for the user."
        );
        break;
    }

    // function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationIsOn(true);
        },
        () => {
          setLocationIsOn(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }, [currentHref]);

  return (
    <Router>
      <div className="container">
        <div id="info">
          <h2>Weather app</h2>
          <p className="main-descr">
            Weather app based on ReactJs framework which uses{" "}
            <a href="https://developers.google.com/maps/documentation/places/web-service/autocomplete">
              Google Place autocomplete library
            </a>
            ,{" "}
            <a href="https://developers.google.com/maps/documentation/places/web-service/search">
              Google place search API
            </a>{" "}
            and{" "}
            <a href="https://openweathermap.org/api"> Open Weather Map API</a>.
          </p>
          {locationIsOn && (
            <div className="current">
              <p className="title">Current page</p>
              <p className="descr">{currentHref}</p>

              <p className="title">Description</p>
              <p className="descr">{description}</p>
            </div>
          )}
          {locationIsOn && (
            <footer>
              <p className="credit">
                Design from{" "}
                <a href="https://dribbble.com/shots/15292603-Weather-Conceptual-App-Design/">
                  Dribbble
                </a>
              </p>
            </footer>
          )}
        </div>

        <div id="frame">
          {locationIsOn ? (
            <div id="frame-inner">
              <Route
                exact
                path="/"
                render={() => {
                  return <Redirect to="/home" />;
                }}
              />

              <Switch>
                <NavContext.Provider value={setcurrentHref}>
                  <Route
                    exact
                    path="/home"
                    render={(props) => (
                      <Home {...props} data={data} returnDate={returnDate} />
                    )}
                  />

                  <Route
                    path="/saved"
                    render={(props) => <Saved {...props} data={data} />}
                  />

                  <Route
                    path="/location"
                    render={(props) => (
                      <Location
                        {...props}
                        data={returnedData}
                        getData={getData}
                      />
                    )}
                  />
                </NavContext.Provider>
              </Switch>

              <div className="container navigation-container">
                <div className="navigation">
                  <Link to="/home">
                    <FontAwesomeIcon
                      className={currentHref == "/home" ? "activeTab" : ""}
                      icon={faHome}
                    />
                  </Link>
                  <Link to="/saved">
                    <FontAwesomeIcon
                      className={currentHref == "/saved" ? "activeTab" : ""}
                      icon={faHeart}
                    />
                  </Link>
                  <Link to="/location">
                    <FontAwesomeIcon
                      className={currentHref == "/location" ? "activeTab" : ""}
                      icon={faMapMarkerAlt}
                    />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="warning">
              Please, enable location translation in site settings in order for
              this app to work.
            </p>
          )}
        </div>
      </div>
    </Router>
  );
}
