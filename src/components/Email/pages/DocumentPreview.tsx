"use client";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentViewer } from "react-documents";

interface FilePreviewProps {
  id: string;
  msgId: string;
  data: {
    attachment_url: string;
    attachment_type: string;
    attachment_name: string;
  }[];
}

const DocumentPreview = ({ url }: { url: string }) => {
  const router = useRouter();
  const decodedUrl = decodeURIComponent(url);
  console.log("decodedUrl", decodedUrl);
  if (!decodedUrl) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No file available for preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px]  rounded-lg overflow-hidden">
      <div className="flex border-b border-gray-200 pb-5 items-center justify-between">
        <Link href="/Email">
          <h1 className="flex text-xl font-semibold items-center gap-2">
            <Bot className="w-5 h-5 text-muted-foreground" />
            Email
          </h1>
        </Link>

        <Button
          variant="outline"
          className="border-0"
          onClick={() => router.back()}
        >
          Back to Email
        </Button>
      </div>

      <DocumentViewer queryParams="hl=Nl" url={decodedUrl} />
    </div>
  );
};

export default DocumentPreview;
