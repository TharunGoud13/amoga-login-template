import Form from "next/form";
import { signOut as vercelSignOut } from "@/app/(auth-vercel)/auth";
import { signOut as mainSignOut } from "@/auth";

export const SignOutForm = () => {
  return (
    <Form
      className="w-full"
      action={async () => {
        "use server";
        // Sign out from both auth systems
        await Promise.all([
          vercelSignOut({
            redirectTo: "/login",
          }),
          mainSignOut({
            redirectTo: "/applogin",
          }),
        ]);
      }}
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </Form>
  );
};
