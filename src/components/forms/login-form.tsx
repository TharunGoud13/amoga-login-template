"use client";
import { FC, useState } from "react";
import GoogleSignInButton from "../google-auth-button";
import GithubSignInButton from "../github-auth-button";
import LinkedInSignInButton from "../linkedin-auth-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "framer-motion"
import JoinPage from "./login-forms/join-page";
import LoginPage from "./login-forms/login-page";
import SignOnPage from "./login-forms/sign-on-page";
import FacebookInSignInButton from "../facebook-auth-button";
import TwitterSignInButton from "../twitter-auth-button";

const LoginForm: FC<any> = () => {
  const [selectedTab, setSelectedTab] = useState('login')

  return (
    <>
    <Tabs defaultValue="login" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="relative flex w-full h-10 bg-transparent px-6 pt-2 pb-3">
              <div className="flex gap-4">
                <TabsTrigger
                  value="login" 
                  className="relative z-20 data-[state=active]:font-semibold p-0 h-auto bg-transparent hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
                >
                  <span className="relative">
                    Login
                    {selectedTab === 'login' && (
                      <motion.div 
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground"
                        layoutId="underline"
                        initial={false}
                      />
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="join" 
                  className="relative z-20 data-[state=active]:font-semibold p-0 h-auto bg-transparent hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
                >
                  <span className="relative">
                    Join
                    {selectedTab === 'join' && (
                      <motion.div 
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground"
                        layoutId="underline"
                        initial={false}
                      />
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="signon" 
                  className="relative z-20 data-[state=active]:font-semibold p-0 h-auto bg-transparent hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
                >
                  <span className="relative">
                    Sign On
                    {selectedTab === 'signon' && (
                      <motion.div 
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground"
                        layoutId="underline"
                        initial={false}
                      />
                    )}
                  </span>
                </TabsTrigger>
              </div>
            </TabsList>
            <div className="px-6 py-4">
              <TabsContent value="login">
                <LoginPage/>
              </TabsContent>
              <TabsContent value="join">
                  <JoinPage/>
              </TabsContent>
              <TabsContent value="signon">
              <SignOnPage/>
              </TabsContent>
            </div>
          </Tabs>
          <div className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <GithubSignInButton/>
            <GoogleSignInButton/>
            <FacebookInSignInButton/>
            <LinkedInSignInButton/>
            <TwitterSignInButton/>
          </div>
        </div>
    </>
  );
};

export default LoginForm;
