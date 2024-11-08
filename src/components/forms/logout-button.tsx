"use client";

import { logout } from "@/app/actions";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const LogoutButton: FC<any> = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="p-2.5 text-primary  font-semibold dark:text-white dark:bg-black rounded-lg"
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </button>
    </>
  );
};

export default LogoutButton;
