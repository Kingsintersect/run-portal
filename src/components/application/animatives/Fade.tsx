import React, { useEffect, useState } from 'react';
import '@/app/animations.css'; // Import the CSS file
import { cn } from '@/lib/utils';

type FadeProps = {
   in: boolean;
   duration?: number; // Optional prop to control the duration of the animation
   children: React.ReactNode;
   className?: string;
};

const Fade: React.FC<FadeProps> = ({ in: show, duration = 500, children, className }) => {
   const [shouldRender, setShouldRender] = useState(show);

   useEffect(() => {
      if (show) {
         setShouldRender(true);
      } else {
         const timeoutId = setTimeout(() => setShouldRender(false), duration);
         return () => clearTimeout(timeoutId);
      }
   }, [show, duration]);

   return shouldRender ? (
      <div
         className={cn({
            'fade-in': show,
            'fade-out': !show,
         }, className)}
         style={{ animationDuration: `${duration}ms` }}
      >
         {children}
      </div>
   ) : null;
};

export default Fade;
