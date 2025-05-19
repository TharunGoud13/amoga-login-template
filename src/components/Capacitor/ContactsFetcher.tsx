"use client";

import { useEffect } from "react";
import { Contacts } from "@capacitor-community/contacts";

const ContactFetcher = () => {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const permission = await Contacts.requestPermissions();
        console.log("Permission response:", permission);
        if (permission.contacts !== "granted") {
          console.error("Permission denied");
          return;
        }

        const { contacts } = await Contacts.getContacts({
          projection: { name: true, phones: true, image: true },
        });

        console.log("Contacts:", contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    // Wait for the Capacitor/Cordova bridge to be ready
    const onDeviceReady = () => {
      console.log("Device is ready");
      fetchContacts();
    };

    if (document.readyState === "complete") {
      if ((window as any).cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
      } else {
        onDeviceReady();
      }
    } else {
      document.addEventListener("deviceready", onDeviceReady, false);
    }
  }, []);

  return <p>Fetching contacts...</p>;
};

export default ContactFetcher;
