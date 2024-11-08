import { Button } from "@/components/ui/button";

const SignOnPage = () => {
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full flex items-center justify-start space-x-2"
      >
        <span>Sign in with SAP</span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-start space-x-2"
      >
        <span>Sign in with Oracle</span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-start space-x-2"
      >
        <span>Sign in with Salesforce</span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-start space-x-2"
      >
        <span>Sign in with HubSpot</span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-start space-x-2"
      >
        <span>Sign in with Microsoft Teams</span>
      </Button>
    </div>
  );
};

export default SignOnPage;
