import listenForNotifications from "@/utils/listeners";

export async function GET() {
  listenForNotifications();
  return Response.json({ message: "Listener started" });
}
