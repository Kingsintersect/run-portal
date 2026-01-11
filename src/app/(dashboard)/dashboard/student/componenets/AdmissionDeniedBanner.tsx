import { TriangleAlert } from "lucide-react";

const AdmissionDeniedBanner = ({ statement }: { statement: string }) => {
   return (
      <div className="flex items-stretch gap-5 min-h-48 bg-white shadow-sm my-10">
         <div className="grow-0 min-w-80  bg-red-100">
            <div className="flex flex-col gap-3 h-full items-center justify-center">
               <TriangleAlert className="h-14 w-14" />
               <span className=" text-orange-700 text-2xl font-bold">Admission Denied</span>
            </div>
         </div>
         <div className="grow py-5 text-slate-700 text-base">
            <div className="flex flex-col h-5/6 gap-3">
               <h4 className="text-xl font-bold tracking-wide">Your admission was denied for the following reasons... </h4>
               <p className="text-lg leading-loose">{statement}</p>

            </div><p className="self-end font-bold text-orange-800">BY: Admission Officer</p>
         </div>
      </div>
   )
}

export default AdmissionDeniedBanner