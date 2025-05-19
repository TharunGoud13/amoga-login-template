"use client";

import { useEffect, useState } from "react";
import ContactFetcher from "./ContactsFetcher";

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

  // Function to check if device is ready and plugins are available
  const waitForDeviceReady = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.cordova) {
        document.addEventListener("deviceready", () => resolve(), false);
      } else {
        // If not in Cordova environment, resolve immediately
        resolve();
      }
    });
  };

  // Request SIM info
  useEffect(() => {
    const getSimInfo = async () => {
      try {
        await waitForDeviceReady();

        // Check if we're in a Cordova environment
        if (!window.cordova) {
          setSimError("Not running in mobile environment");
          return;
        }

        // Check if the sim plugin is available
        if (!window.plugins?.sim) {
          setSimError("SIM plugin not available");
          return;
        }

        // Check if diagnostic plugin is available
        if (!window.cordova.plugins?.diagnostic) {
          setSimError("Diagnostic plugin not available");
          return;
        }

        // First check current permission status
        window.cordova.plugins.diagnostic.getPermissionAuthorizationStatus(
          (status: string) => {
            console.log("Current SIM permission status:", status);

            if (status === "GRANTED") {
              // Permission already granted, get SIM info
              getSIMInfo();
            } else {
              // Request permission
              requestSIMPermission();
            }
          },
          (error: any) => {
            console.error("Error checking SIM permission status:", error);
            // Try requesting permission anyway
            requestSIMPermission();
          },
          window.cordova.plugins.diagnostic.permission.READ_PHONE_STATE
        );

        const requestSIMPermission = () => {
          // Request multiple permissions that might be needed
          const permissions = [
            window.cordova.plugins.diagnostic.permission.READ_PHONE_STATE,
            window.cordova.plugins.diagnostic.permission.READ_PHONE_NUMBERS,
          ];

          window.cordova.plugins.diagnostic.requestRuntimePermissions(
            (statuses: any) => {
              console.log("Permission statuses:", statuses);

              // Check if any of the permissions were granted
              const hasPermission = Object.values(statuses).some(
                (status: any) => status === "GRANTED"
              );

              if (hasPermission) {
                getSIMInfo();
              } else {
                setSimError("SIM permissions denied");
              }
            },
            (error: any) => {
              console.error("Permission request error:", error);
              setSimError("Permission request failed: " + error);
            },
            permissions
          );
        };

        const getSIMInfo = () => {
          window.plugins.sim.getSimInfo(
            (info: any) => {
              console.log("SIM info received:", info);

              // Try different properties that might contain the phone number
              const phoneNumber =
                info.phoneNumber ||
                info.msisdn ||
                info.subscriberId ||
                info.line1Number;

              if (phoneNumber) {
                setNumber(phoneNumber);
              } else {
                setNumber("Phone number not available from SIM");
                console.log("Available SIM info:", info);
              }
            },
            (error: any) => {
              console.error("SIM fetch error:", error);
              setSimError("Failed to fetch SIM info: " + JSON.stringify(error));
            }
          );
        };
      } catch (error) {
        console.error("Error in getSimInfo:", error);
        setSimError("Unexpected error: " + error);
      }
    };

    getSimInfo();
  }, []);

  // Request location (keeping your existing logic)
  useEffect(() => {
    const requestLocationPermissionAndFetch = async () => {
      try {
        await waitForDeviceReady();

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
      } catch (error) {
        setLocationError("Unexpected error: " + error);
      }
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
      <ContactFetcher />
    </div>
  );
};

export default SimInfo;
