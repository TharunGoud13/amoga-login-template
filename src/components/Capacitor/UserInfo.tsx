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
    const getSimInfo = () => {
      try {
        if (!window.plugins?.sim) {
          console.log("SIM plugin not found.");
          setError("SIM plugin not available");
          return;
        }

        window.plugins.sim.getSimInfo(
          (info: any) => {
            console.log("SIM Info:", info);
            setNumber(info.phoneNumber || "Number not available");
          },
          (err: any) => {
            console.error("Error getting SIM info:", err);
            setError("Failed to fetch SIM info");
          }
        );
      } catch (e: any) {
        console.error("Unexpected error caught:", e);
        setError(e.message || "Unexpected error");
      }
    };

    getSimInfo();
  }, []);

  return (
    <div>
      <h3>SIM Info---------</h3>
      {number ? <p>Mobile Number: {number}</p> : <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SimInfo;
