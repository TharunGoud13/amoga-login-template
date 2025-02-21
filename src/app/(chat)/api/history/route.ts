import { getAuthSession } from "@/lib/vercel-ai/auth-wrapper";
import { getChatsByUserId } from "@/lib/vercel-ai/db/queries";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chats = await getChatsByUserId({ id: session.user.id.toString() });
    return Response.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return Response.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
