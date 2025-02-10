import { auth } from "@/auth";
import LogoutButton from "@/components/forms/logout-button";
import React from "react";

const Home = async () => {
  const session = await auth();
  return (
    <div className="flex bg-background/95 h-screen w-screen items-center justify-center">
      <span className="text-primary">Hello {session?.user?.name}</span>
      <LogoutButton />
    </div>
  );
};

export default Home;
