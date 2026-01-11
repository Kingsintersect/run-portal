import React from 'react'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"

const CourseManagement = () => {
   return (
      <div className='grid lg:grid-cols-2 gap-7'>
         <Card className='col-span-1'>
            <CardHeader>
               <CardTitle>Card Title</CardTitle>
               <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
               <p>Card Content</p>
            </CardContent>
            <CardFooter>
               <p>Card Footer</p>
            </CardFooter>
         </Card>
         <Card className='col-span-1'>
            <CardHeader>
               <CardTitle>Card Title</CardTitle>
               <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
               <p>Card Content</p>
            </CardContent>
            <CardFooter>
               <p>Card Footer</p>
            </CardFooter>
         </Card>
      </div>
   )
}

export default CourseManagement