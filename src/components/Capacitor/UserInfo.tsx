"use client";
import getUserLocation from "@/utils/getGeoLocation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    plugins: any;
    cordova?: any;
  }
}

const SimInfo = () => {
  const [number, setNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getUserLocation();
      setLocation(location);
    };
    fetchLocation();
  });

  console.log("location-----", location);

  useEffect(() => {
    const getSimInfo = async () => {
      if (!window.plugins?.sim) {
        setError("SIM plugin not available");
        return;
      }
      console.log("window---plugin---", window.plugins.sim);

      window.cordova.plugins.diagnostic.requestRuntimePermission(
        (status: any) => {
          console.log("status-----------", status);
          if (status === "GRANTED") {
            window.plugins.sim.getSimInfo(
              (info: any) => {
                console.log("info---------", info);
                return setNumber(info.phoneNumber || "Number not available");
              },
              (err: any) => {
                console.error("err--------", err);
                setError("Failed to fetch SIM info");
              }
            );
          } else {
            setError("Permission denied");
          }
        },
        (err: any) => {
          console.error(err);
          setError("Permission request failed");
        },
        "android.permission.READ_PHONE_NUMBERS"
      );
    };

    getSimInfo();
  }, []);

  return (
    <div>
      <h3>SIM Info---------</h3>
      {number ? <p>Mobile Number: {number}</p> : <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1>User Location: {location?.address?.village}</h1>
    </div>
  );
};

export default SimInfo;
