import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWind, faTint, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

// styles
import "./weatherBar.scss"

export default function WeatherBar(props) {
    let weather = props.weather;
    let styles = {}

    if(props.alignment) {
        styles = {
            justifyContent: props.alignment
        }
    }

    return (
        <div className="weather-main">
            <ul style={styles}>
                <li><FontAwesomeIcon icon={faWind}/><span>{weather.wind}</span></li>
                <li><FontAwesomeIcon icon={faTint}/><span>{weather.humidity}%</span></li>
                <li><FontAwesomeIcon icon={faInfoCircle}/><span>{weather.pressure}</span></li>
            </ul>
        </div>
    )
}

