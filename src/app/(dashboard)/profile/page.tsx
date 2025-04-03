import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import MyProfile from "./Profile/page"
import Address from "./Address/page"
import Email from "./Email/page"

const Profile = ()  => {
  return (
    <div className="mt-[1%] h-full">
            <Tabs defaultValue="email">
                <TabsList className="ml-[2%] bg-secondary text-primary rounded">
                    <TabsTrigger value="my-profile">Profile</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
                <TabsContent value="my-profile" className="m-[30px]">
                    <MyProfile/>
                </TabsContent>
                <TabsContent value="address" className="m-[30px]">
                    <Address/>
                </TabsContent>
                <TabsContent value="email" className="m-[30px]">
                    <Email/>
                </TabsContent>
            </Tabs>
        </div>
  )
}


export default Profile