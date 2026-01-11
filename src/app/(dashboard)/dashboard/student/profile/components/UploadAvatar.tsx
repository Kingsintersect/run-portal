"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, Upload } from "lucide-react";

interface UploadAvatarProps {
   imageUrl: string;
}

const UploadAvatar = ({ imageUrl }: UploadAvatarProps) => {
   const [avatar, setAvatar] = useState(imageUrl);
   const [isHovering, setIsHovering] = useState(false);

   const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         const imageUrl = URL.createObjectURL(file);
         setAvatar(imageUrl); // You should upload it to the server
      }
   };

   return (
      <div className="relative">
         {/* Cover Image */}
         <div className="relative h-32 w-full rounded-xl overflow-hidden mb-16">
            <Image
               src="/random/rand1.jpg"
               alt="Profile Banner"
               fill
               style={{ objectFit: "cover" }}
               className="transition-transform hover:scale-105 duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <label className="absolute bottom-3 right-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white p-2 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 text-sm font-medium">
               <Camera className="h-4 w-4" />
               Change Cover
               <input type="file" className="hidden" accept="image/*" />
            </label>
         </div>

         {/* Profile Avatar */}
         <div
            className="absolute left-1/2 top-16 -translate-x-1/2 w-24 h-24"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
         >
            <div className="relative w-full h-full">
               <div className={`absolute inset-0 rounded-full ${isHovering ? 'ring-4 ring-blue-500 ring-offset-2' : 'ring-4 ring-white dark:ring-gray-800'} transition-all duration-300`}>
                  <Image
                     src="/random/profile-avatar.jpg"
                     alt="UserInterface Avatar"
                     fill
                     className="rounded-full object-cover"
                  />
               </div>

               <label className={`absolute inset-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${isHovering ? 'bg-black/60' : 'bg-transparent'}`}>
                  <div className={`transform transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'} text-white flex flex-col items-center`}>
                     <Upload className="h-6 w-6" />
                     <span className="text-xs font-medium mt-1">Upload</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
               </label>
            </div>
         </div>
      </div>
   );
};

export default UploadAvatar;
