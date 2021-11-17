import { useState } from "react"

function Preloader({states}) {
    const [fading, setFading] = useState(false)
    const [hidden, setHidden] = useState(false)

    function hideLoading() {
        setFading(true)
        setTimeout(() => setHidden(true), 600)
    }

    if(states) {
        setTimeout(() => hideLoading(), 300)
    }

    

    return (
        <div className="loading" style={{
            opacity: fading ? 0 : 1,
            display: hidden ? "none" : "flex"}}>
            <div className="preloader"></div>
        </div>
    )
}

export default Preloader;