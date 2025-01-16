import { generateTemplate } from "@/components/story_builder/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { generatePugTemplate } from "./actions";
import { Textarea } from "@/components/ui/textarea";

interface PugTemplateProps {
  data: string[];
  componentName: string;
}

const PugStoryTemplate = ({ data, componentName }: PugTemplateProps) => {
  console.log("pug-----", { data, componentName });
  const [loading, setLoading] = useState(false);
  const [pugTemplate, setPugTemplate] = useState("");
  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (!data) {
        toast({
          variant: "destructive",
          description: "Please enter required field",
        });
      }
      const template = await generatePugTemplate(data);
      setLoading(false);
      setPugTemplate(template);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "An error occurred while generating template",
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex justify-end mt-2 items-center">
        <Button
          variant="outline"
          size="sm"
          disabled={!data || loading}
          onClick={handleGenerate}
        >
          <Wand2 className="w-4 h-4 mr-2 " />
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pugTemplate">.pug Template</Label>
        <CodeEditor
          id="pugTemplate"
          value={pugTemplate}
          placeholder="Enter your .pug template here..."
          language="pug"
          className="min-h-[200px] rounded-md"
        />
      </div>
      <div className="space-y-2 mt-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="prompt">AI Story Prompt</Label>
          <Button
            variant="outline"
            size="sm"
            disabled={!data || loading}
            onClick={() => {}}
          >
            <Wand2 className="w-4 h-4 mr-2 " />
            {"Generate"}
          </Button>
        </div>
        <Textarea
          className="min-h-[100px]"
          id="prompt"
          placeholder="Enter Prompt"
        />
      </div>
      <div className="space-y-2 mt-5">
        <Label htmlFor="response">AI Story</Label>

        <Textarea className="min-h-[200px]" placeholder="AI Story" />
      </div>
    </div>
  );
};

export default PugStoryTemplate;
