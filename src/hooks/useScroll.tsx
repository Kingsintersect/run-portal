import { useCallback, useEffect, useState } from "react";

export default function useScroll(threshold: number) {
   const [scrolled, setscrolled] = useState(false);

   const onScroll = useCallback(() => {
      setscrolled(window.scrollY > threshold);
   }, [threshold]);

   useEffect(() => {
      window.addEventListener("scroll", onScroll);

      return () => window.removeEventListener("scroll", onScroll)
   }, [onScroll]);

   // check on forst load
   useEffect(() => {
      onScroll();
   }, [onScroll])

}