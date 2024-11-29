import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import Header from "@/components/layout/topNav";
import PublicHeader from "@/components/layout/publicTopNav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Never Delay Decisions",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
    {session?.user ? <Header/> : <PublicHeader/>}
      <div className="flex overflow-hidden">
        <main className="w-full pt-14">{children}</main>
      </div>
    </>
  );
}
