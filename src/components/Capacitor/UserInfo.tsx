"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    plugins: any;
    cordova: any;
  }
}

const SimInfo = () => {
  const [number, setNumber] = useState<string | null>(null);
  const [simError, setSimError] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Request SIM info
  useEffect(() => {
    const getSimInfo = async () => {
      if (!window.plugins?.sim) {
        setSimError("SIM plugin not available");
        return;
      }

      window.cordova.plugins.diagnostic.requestRuntimePermission(
        (status: any) => {
          if (status === "GRANTED") {
            window.plugins.sim.getSimInfo(
              (info: any) => {
                console.log("SIM info:", info);
                setNumber(info.phoneNumber || "Number not available");
              },
              (err: any) => {
                console.error("SIM fetch error", err);
                setSimError("Failed to fetch SIM info");
              }
            );
          } else {
            setSimError("SIM permission denied");
          }
        },
        (err: any) => {
          console.error("Permission error", err);
          setSimError("Permission request failed");
        },
        "android.permission.READ_PHONE_NUMBERS"
      );
    };

    getSimInfo();
  }, []);

  // Request location
  useEffect(() => {
    const requestLocationPermissionAndFetch = () => {
      if (!window.cordova?.plugins?.diagnostic) {
        setLocationError("Diagnostic plugin not available");
        return;
      }

      window.cordova.plugins.diagnostic.requestRuntimePermission(
        (status: any) => {
          if (status === "GRANTED") {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                  );
                  const data = await res.json();
                  setLocation({
                    lat: latitude,
                    lon: longitude,
                    address: data.address,
                  });
                } catch (err) {
                  setLocationError("Failed to fetch address");
                }
              },
              (error) => {
                setLocationError("Geolocation error: " + error.message);
              }
            );
          } else {
            setLocationError("Location permission denied");
          }
        },
        (error: any) => {
          console.error("Location permission error", error);
          setLocationError("Permission request failed");
        },
        window.cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION
      );
    };

    requestLocationPermissionAndFetch();
  }, []);

  return (
    <div>
      <h3>SIM Info</h3>
      {number ? <p>Mobile Number: {number}</p> : <p>Loading SIM info...</p>}
      {simError && <p style={{ color: "red" }}>{simError}</p>}

      <h3>User Location</h3>
      {location?.address ? (
        <p>
          {location.address.city || location.address.village || "Unknown City"}
        </p>
      ) : locationError ? (
        <p style={{ color: "red" }}>{locationError}</p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default SimInfo;
