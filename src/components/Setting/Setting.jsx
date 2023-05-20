import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

// styles
import "./Setting.scss";

export default function Setting(props) {
  const [unit, setUnit] = useState(props.active);
  const index = useRef(props.units.indexOf(props.active));

  return (
    <div className="setting">
      <p className="setting__name">{props.name}</p>
      <div className="selection">
        <span>{unit}</span>
        <FontAwesomeIcon
          data-testid="arrow"
          style={{ color: "#ddd" }}
          icon={faChevronRight}
          onClick={() => {
            index.current += 1;
            if (index.current == props.units.length) index.current = 0;

            setUnit(props.units[index.current]);
            props.setWeatherPieces({
              type: props.type,
              unit: props.units[index.current],
            });
          }}
        />
      </div>
    </div>
  );
}
