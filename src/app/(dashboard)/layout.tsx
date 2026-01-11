import MarginWidthWrapper from "@/components/ui/dashboard/MarginWidthWrapper";
import PageWrapper from "@/components/ui/dashboard/PageWrapper";
import { SITE_NAME } from "@/config";
import { Metadata } from "next"
import TeacherFeedbackIntegration from "./dashboard/components/FeedbackIntegration";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: `${SITE_NAME}`,
   description: "Dashboard Overview",
};

const layout = async ({ children }: { children: React.ReactNode }) => {

   return (
      <div className='bg-white'>
         <main className='flex-1'>
            <MarginWidthWrapper>
               <PageWrapper>{children}</PageWrapper>
               <TeacherFeedbackIntegration />
            </MarginWidthWrapper>
         </main>
      </div>
   )
}

export default layout