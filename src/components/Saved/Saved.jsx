import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faWind,
  faTint,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect, useContext } from "react";
import NavContext from "../Context/NavContext";

import {
  fetchWeather,
  transformUnit,
  getLocationAsText,
} from "../../modules/utilities";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

// styles
import "./Saved.scss";

import Preloader from "../Preloader/Preloader";

export default function Saved(props) {
  const favorites = useRef([]);
  const index = useRef(0);
  const [currentFavorites, setCurrentFavorites] = useState(favorites.current);
  let settings = JSON.parse(localStorage.getItem("settings"));
  const [address, setAddress] = useState("");
  const [removeFavorites, setRemoveFavorites] = useState(false);
  const [fading, setfading] = useState(true);
  const [visible, setvisible] = useState(false);
  const coordinates = useRef([]);
  const [loaded, setloaded] = useState(false);

  const setNav = useContext(NavContext);

  const handleChange = (address) => {
    setAddress(address);
    dropdown.current.style.display = "block";
  };

  function toggleCard() {
    setTimeout(() => setvisible(!visible), visible ? 400 : 0);
    setTimeout(() => setfading(!fading), fading ? 200 : 0);
  }

  useEffect(() => {
    const coords = JSON.parse(localStorage.getItem("locations")) || [];
    if (coords.length) {
      const promises = [];

      coords.forEach((place) => {
        promises.push(updateCards(place.lat, place.lng));
      });

      Promise.all(promises).then(() => {
        setloaded(true);
      });
    } else {
      setloaded(true);
    }

    setNav(props.location.pathname);
  }, []);

  async function updateCards(lat, lng) {
    return fetchWeather(lat, lng).then((weather) => {
      return getLocationAsText(lat, lng, false, true).then((namedLocation) => {
        const [city, country] = namedLocation;
        // set the right units
        let temperature = transformUnit(
          "temperature",
          weather.main.feels_like,
          settings.temperature
        ).replace(/[a-zA-Z]/g, "");
        let wind = transformUnit("speed", weather.wind.speed, settings.speed);

        favorites.current.push({
          city,
          country,
          temperature,
          wind,
          humidity: weather.main.humidity,
          id: weather.weather[0].id,
          index: index.current++,
          lat,
          lng,
        });

        coordinates.current.push({ lat, lng });
        localStorage.setItem("locations", JSON.stringify(coordinates.current));

        setCurrentFavorites([...favorites.current]);

        return namedLocation;
      });
    });
  }

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        updateCards(latLng.lat, latLng.lng);
      })
      .catch((error) => console.error("Error", error));
  };

  const dropdown = useRef(null);

  function removeCard(index) {
    const card = favorites.current.find((fav) => fav.index === index);

    coordinates.current = coordinates.current.filter(
      (place) => place.lat !== card.lat && place.lng !== card.lng
    );
    // console.log(card)

    favorites.current = favorites.current.filter((fav) => fav.index !== index);
    setCurrentFavorites([...favorites.current]);

    localStorage.setItem("locations", JSON.stringify(coordinates.current));
  }

  return (
    <div id="wrapper" style={{ height: "100%" }}>
      <div className="container">
        <div className="search">
          <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
            searchOptions={{ type: "(countries)" }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <div>
                <div className="search-bar">
                  <FontAwesomeIcon icon={faSearch} />

                  <input
                    {...getInputProps({
                      placeholder: "Search Places ...",
                      className: "location-search-input",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    <FontAwesomeIcon
                      style={{ cursor: "pointer" }}
                      icon={faEdit}
                      onClick={() => {
                        setRemoveFavorites(!removeFavorites);
                        toggleCard();
                      }}
                    />
                  </div>
                </div>

                <div
                  ref={dropdown}
                  className="search-results"
                  style={suggestions.length ? {} : { display: "none" }}
                >
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";

                    return (
                      <p
                        key={suggestion.description}
                        {...getSuggestionItemProps(suggestions)}
                        onClick={() => {
                          setAddress(suggestion.description);
                          handleSelect(address);
                          dropdown.current.style.display = "none";
                        }}
                        className={className}
                      >
                        {suggestion.description}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        <div className="favorites">
          {currentFavorites.length ? (
            currentFavorites.map((fav) => {
              return (
                <div className="favorite" key={fav.index}>
                  <p className="temp">{fav.temperature}</p>
                  <p className="city">{fav.city}</p>
                  <p className="country">{fav.country}</p>
                  <div className="quick-info">
                    <div>
                      <FontAwesomeIcon icon={faTint} /> {fav.humidity}%
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faWind} /> {fav.wind}
                    </div>
                  </div>
                  <i className={`wi wi-owm-${fav.id}`}></i>

                  <span
                    className={fading ? "" : "shown"}
                    style={visible ? null : { display: "none" }}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      onClick={() => {
                        removeCard(fav.index);
                      }}
                    />
                  </span>
                </div>
              );
            })
          ) : (
            <p className="no-results">
              You do not have any saved locations yet
            </p>
          )}
        </div>
      </div>

      <Preloader loaded={loaded} />
    </div>
  );
}
