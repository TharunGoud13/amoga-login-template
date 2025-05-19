// components/ContactFetcher.tsx
"use client";

import { useEffect } from "react";
import { Contacts } from "@capacitor-community/contacts";

const ContactFetcher = () => {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const permission = await Contacts.requestPermissions();
        if (permission.contacts !== "granted") {
          console.error("Permission denied");
          return;
        }
        console.log("permission---------", permission);

        const { contacts } = await Contacts.getContacts({
          projection: { name: true, phones: true, image: true },
        });

        console.log("Contacts:----------", contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return <p>Fetching contacts... </p>;
};

export default ContactFetcher;
