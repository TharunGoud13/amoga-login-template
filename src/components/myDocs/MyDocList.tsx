import { MY_DOC_LIST } from "@/constants/envConfig";
import React, { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Edit, Eye, Loader, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Session } from "../doc-template/DocTemplate";
import { useSession } from "next-auth/react";

const MyDocList = () => {
  const [docList, setDocList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    const fetchDocList = async () => {
      setIsLoading(true);
      const response = await fetch(MY_DOC_LIST, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      if (!response.ok) {
        toast({
          description: "Error fetching Doc List",
          variant: "destructive",
        });
      }
      const data = await response.json();
      const filteredData = data.filter(
        (item: any) => item.business_number === session?.user?.business_number
      );
      setDocList(filteredData);
      setIsLoading(false);
    };
    fetchDocList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center  items-center ">
          <Loader className="animate-spin" />
        </div>
      )}
      {!isLoading && (
        <div>
          {docList.map((doc: any) => (
            <div key={doc.mydoc_list_id} className="border-b-2 space-y-3 p-2.5">
              <h1 className="text-2xl font-bold">{doc.doc_name}</h1>
              <p className="text-sm text-gray-500">
                {new Date(doc.created_date).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <p className="text-sm text-gray-500">
                      {doc.created_user_name}
                    </p>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => {
                      router.push(`/myDocs/view/${doc.mydoc_list_id}`);
                    }}
                  />
                  <Edit
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => {
                      router.push(`/myDocs/edit/${doc.mydoc_list_id}`);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDocList;
