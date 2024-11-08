import NextAuth from "next-auth";
import { ssoProviders } from "./lib/sso-config";

export const { handlers: { GET, POST }, auth, signIn, signOut } =  NextAuth(
  {
  
  providers: [
    ...ssoProviders
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        
        token.user=user
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.user?.id;
        session.user.email = token?.email;
        session.user.name = token?.name;
        session.user.mobile = token?.user?.mobile;
        session.user.business_number = token?.user?.business_number;
        session.user.business_name = token?.user?.business_name;
        
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
})