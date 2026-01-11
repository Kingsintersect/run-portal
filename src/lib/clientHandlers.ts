"use client";
// APPLICATION
export function isStringEmpty(str: any) {
   if (typeof str === "string" && str.length === 0) {
      console.log("The string is empty");
      return false;
   } else if (str === null) {
      console.log("The string is null");
      return false;
   } else {
      return str;
   }
}