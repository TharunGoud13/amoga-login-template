import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";

export const ssoProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
  LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        const response = await fetch(
          "https://amogademo-postgrest.morr.biz/user_catalog",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const users = await response.json();
        const user = users.find(
          (u:any) =>
            u.user_email === credentials.email &&
            u.password === credentials.password
        );

        if (user) {
          return {
            id: user.user_catalog_id,
            email: user.user_email,
            name: user.user_name,
            mobile: user.user_mobile,
            business_number: user.business_number,
            picture: user.user_picture,
            business_name: user.business_name,
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  }),
];

export const showProviderButtons = {
  google: true,
  github: true,
  linkedin: true,
}
