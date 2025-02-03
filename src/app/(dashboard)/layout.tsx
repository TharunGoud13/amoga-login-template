import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import Header from "@/components/layout/topNav";

export const metadata: Metadata = {
  title: "morr",
  description: "Never Delay Decisions",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-14 items-center justify-center text-center">
        <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent"></span>
        <h2 className="my-2 font-heading text-2xl font-bold">
          Something&apos;s missing
        </h2>
        <p>Sorry, your session expired , please login again</p>
        <div className="mt-8 flex justify-center gap-2">
          <Link
            href="/applogin"
            className="bg-secondary h-9 hover:bg-secondary/80 px-4 py-2 rounded-md text-sm"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header session={session} />
      <div className="flex overflow-hidden">
        <main className="w-full pt-14">{children}</main>
      </div>
    </>
  );
}
