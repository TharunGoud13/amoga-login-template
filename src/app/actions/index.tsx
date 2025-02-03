"use server";

import { signIn, signOut } from "@/auth";

export async function login(formData: any) {
  const source = formData;
  await signIn(source, { redirectTo: "/role_menu" });
}

export async function logout() {
  await signOut({ redirectTo: "/applogin" });
}
