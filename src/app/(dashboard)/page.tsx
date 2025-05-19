import { auth } from "@/auth";
import UserInfo from "@/components/Capacitor/UserInfo";
import LogoutButton from "@/components/forms/logout-button";
import React from "react";
import { Contacts, PermissionStatus } from "@capacitor-community/contacts";

const Home = async () => {
  const session = await auth();
  const permissionState: PermissionStatus = await Contacts.requestPermissions();
  if (permissionState.contacts === "granted") {
    console.log("Permission Granted");
  }
  const { contacts } = await Contacts.getContacts({
    projection: { name: true, phones: true, image: true },
  });

  console.log("contacts-----------", contacts);

  return (
    <div className="flex flex-col bg-background/95 h-screen w-screen items-center justify-center">
      <div>
        <span className="text-primary">Hello {session?.user?.name}</span>
        <LogoutButton />
      </div>
      <div>
        <UserInfo />
      </div>
    </div>
  );
};

export default Home;
