import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TabsComponents = () => {
  return (
    <Tabs defaultValue="profile-data" className="w-[400px]">
        <TabsList>
            <TabsTrigger value="profile-data">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default Tabs