"use client";
import { useEffect, useState } from "react";
import { Session } from "@/components/form-builder-2/FormBuilder";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

interface FormData {
  formContent: string;
  formName: string;
  submittedData: any;
}

const SubmitSuccess = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData | null>(null);

  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    // Get data from URL parameters
    const formContent = searchParams.get("form_content");
    const formName = searchParams.get("form_redirect_url");
    const submittedDataStr = searchParams.get("submittedData");

    if (formContent || formName || submittedDataStr) {
      setFormData({
        formContent: formContent || "",
        formName: formName || "",
        submittedData: submittedDataStr ? JSON.parse(submittedDataStr) : {},
      });
    }
  }, [searchParams]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: "URL copied Successfully", variant: "default" });
  };

  const handleViewForm = () => {
    // Navigate back to the form page
    router.back();
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No submission data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col rounded-lg p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4 pb-4 border-b">
                🎊 Form Submitted Successfully! 🎊
              </h1>

              {formData.formContent && (
                <div
                  className="prose max-w-none mt-6 p-4 bg-muted rounded-lg"
                  dangerouslySetInnerHTML={{ __html: formData.formContent }}
                />
              )}
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {formData.formName || "Form"} Submitted
                </h2>
                <p className="text-muted-foreground">
                  Your response has been recorded
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1"
                  onClick={handleCopyLink}
                  variant="outline"
                >
                  Copy Link
                </Button>
                <Button className="flex-1" onClick={handleViewForm}>
                  New Form
                </Button>
              </div>

              {/* {formData.submittedData && (
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Submission Summary
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(formData.submittedData).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccess;
