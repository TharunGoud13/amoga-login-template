"use client";

import { useEffect } from "react";
import { Contacts } from "@capacitor-community/contacts";

const ContactFetcher = () => {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Check if Contacts plugin is available
        if (!Contacts) {
          console.error("Contacts plugin is not available");
          return;
        }

        const permission = await Contacts.requestPermissions();
        console.log("Permission response:", permission);

        if (!permission || permission.contacts !== "granted") {
          console.error("Permission denied");
          return;
        }

        const result = await Contacts.getContacts({
          projection: { name: true, phones: true, image: true },
        });

        console.log("Contacts:", result.contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    const initializeContacts = () => {
      // Wait a short moment to ensure Capacitor is fully initialized
      setTimeout(() => {
        console.log("Initializing contacts...");
        fetchContacts();
      }, 500);
    };

    // For web and iOS
    if (document.readyState === "complete") {
      initializeContacts();
    } else {
      window.addEventListener("load", initializeContacts);
    }

    // Cleanup
    return () => {
      window.removeEventListener("load", initializeContacts);
    };
  }, []);

  return <p>Fetching contacts...</p>;
};

export default ContactFetcher;
