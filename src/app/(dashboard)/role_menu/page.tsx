import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_LIST } from "@/constants/envConfig";
import Link from "next/link";

async function getPageList() {
  const response = await fetch(PAGE_LIST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });
  const data = await response.json();
  console.log("data....", data);
  return data;
}

const RoleList = async () => {
  const session: any = await auth();
  const pageList = await getPageList();

  // Filter pages based on user roles
  const userRoles = session?.user?.roles_json || [];
  const filteredPages = pageList.filter((page: any) => {
    // If page has no roles specified, don't show it
    if (!page.role_json) return false;

    // Parse the role_json if it's a string
    const pageRoles =
      typeof page.role_json === "string"
        ? JSON.parse(page.role_json)
        : page.role_json;

    // Check if user has any of the roles required for this page
    console.log("pageRoles----", pageRoles);
    return userRoles.some((userRole: string) => pageRoles.includes(userRole));
  });

  return (
    <div className="flex flex-col items-center justify-center   w-full min-w-screen gap-4 min-h-screen">
      <div className="flex   w-full justify-center items-center">
        <div className="grid grid-cols-1  w-full md:w-auto px-4 md:px-0 my-5 md:my-0 md:grid-cols-3 gap-4">
          {filteredPages.map((page: any, index: number) => (
            <Link href={`${page.page_link}`} key={index}>
              <Card className="md:w-[300px] w-full h-[75px] md:h-[100px]  flex items-center justify-center">
                <CardContent className="flex items-center justify-center w-full h-full">
                  {page.page_name}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleList;
