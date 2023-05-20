import { useState, useEffect, useRef } from "react";

function Preloader({ loaded }) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const isInitialMount = useRef(true);

  function hideLoading() {
    setFading(true);
    setTimeout(() => setHidden(true), 600);
  }

  useEffect(() => {
    if (loaded) {
      setTimeout(() => hideLoading(), 100);
    }
  }, [loaded]);

  return (
    <div
      className="loading"
      style={{
        opacity: fading ? 0 : 1,
        display: hidden ? "none" : "flex",
      }}
      data-testid="preloader"
    >
      <div className="preloader"></div>
    </div>
  );
}

export default Preloader;
