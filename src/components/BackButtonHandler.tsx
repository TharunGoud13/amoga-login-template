"use client";

import { useEffect } from "react";
import { App as CapApp } from "@capacitor/app";
import { usePathname, useRouter } from "next/navigation";
import { PluginListenerHandle } from "@capacitor/core";

const BackButtonHandler = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let listenerHandle: PluginListenerHandle | null = null;
    CapApp.addListener("backButton", () => {
      if (pathname === "/") {
        CapApp.exitApp();
      } else {
        router.back();
      }
    }).then((handle) => {
      listenerHandle = handle;
    });
    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [pathname, router]);
  return null;
};

export default BackButtonHandler;
