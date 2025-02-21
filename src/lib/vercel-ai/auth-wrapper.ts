import { auth as vercelAuth } from "@/app/(auth-vercel)/auth";
import { auth as mainAuth } from "@/auth";

export async function getAuthSession() {
  try {
    // Try to get main app auth session first
    const mainSession: any = await mainAuth();
    if (mainSession?.user) {
      // Map main session to format expected by Vercel SDK
      return {
        ...mainSession,
        user: {
          id: mainSession.user.user_catalog_id || mainSession.user?.id,
          email: mainSession.user.user_email || mainSession.user?.email,
          name: mainSession.user?.user_name || mainSession.user?.name,
          // Add any other required fields from your main session
          business_number: mainSession.user?.business_number,
        },
      };
    }

    // Fall back to Vercel SDK auth session
    const vercelSession = await vercelAuth();
    if (vercelSession?.user) {
      return vercelSession;
    }

    return null;
  } catch (error) {
    console.error("Auth wrapper error:", error);
    return null;
  }
}

// Helper function to ensure user is authenticated
export async function ensureAuth() {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
