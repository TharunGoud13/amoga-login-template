export default function getUserLocation() {
  if ("geolocation" in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((result) => {
              resolve({
                latitude,
                longitude,
                address: result.address,
              });
            })
            .catch(() => reject("Failed to fetch address"));
        },
        (error) => {
          reject("Geolocation error: " + error.message);
        }
      );
    });
  } else {
    return Promise.reject("Geolocation is not supported by this browser.");
  }
}
