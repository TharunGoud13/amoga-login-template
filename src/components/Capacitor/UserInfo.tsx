// components/SimInfo.tsx
"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    plugins: any;
  }
}

const SimInfo = () => {
  const [number, setNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSimInfo = async () => {
      if (typeof window === "undefined" || !window.plugins?.sim) {
        setError("SIM plugin not available");
        return;
      }
      console.log("window----plugin------", window.plugins);

      try {
        const permission = await (
          window as any
        ).cordova.plugins.diagnostic.requestRuntimePermission(
          (status: any) => {
            console.log("status----------", status);
            if (status === "GRANTED") {
              window.plugins.sim.getSimInfo(
                (info: any) => {
                  setNumber(info.phoneNumber || "Number not available");
                },
                (err: any) => {
                  setError("Failed to fetch SIM info");
                  console.error(err);
                }
              );
            } else {
              setError("Permission denied");
            }
          },
          (err: any) => {
            console.error("Permission error", err);
            setError("Permission request failed");
          },
          "android.permission.READ_PHONE_NUMBERS"
        );
      } catch (e) {
        console.error("Error in SIM plugin", e);
        setError("Unexpected error");
      }
    };

    getSimInfo();
  }, []);

  return (
    <div>
      <h3>SIM Info</h3>
      {number ? <p>Mobile Number: {number}</p> : <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SimInfo;
