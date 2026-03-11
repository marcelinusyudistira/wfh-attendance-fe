import { useState } from "react";

function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const resetLocation = () => {
        setLocation(null);
        setLoadingLocation(false);
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                setLocation(coords);
                setLoadingLocation(false);
            },
            (error) => {
                console.error(error);
                alert("Location access denied");
                setLoadingLocation(false);
            },
        );
    };

    return {
        location,
        loadingLocation,
        getLocation,
        resetLocation,
    };
}

export default useGeolocation;
