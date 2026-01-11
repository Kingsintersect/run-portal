import AppLogo from '@/components/application/AppLogo'
import React from 'react'

const Banner = () => {
   return (
      <div className="container flex flex-col">
         <div className="header flex items-center gap-7 px-[10%] h-[180px] bg-gray-200">
            <AppLogo
               image_url={'/logo/logo.jpg'}
               logo_text_style='text-orange-800 font-bold text-2xl'
               logo_text={'UBD-LMS'}
               Img_container_style='w-32 h-32'
            />
         </div>
      </div>
   )
}

export default Banner