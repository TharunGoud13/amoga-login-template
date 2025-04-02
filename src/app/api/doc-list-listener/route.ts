import listenForMydocListUpdates from "@/utils/doc_list_listener";

export async function GET() {
  try {
    console.log("Starting document list listener...");
    listenForMydocListUpdates();
    console.log("Document list listener started successfully");
    return Response.json({
      message: "Document list listener started successfully",
    });
  } catch (error) {
    console.error("Failed to start document list listener:", error);
    return Response.json(
      { error: "Failed to start listener" },
      { status: 500 }
    );
  }
}
