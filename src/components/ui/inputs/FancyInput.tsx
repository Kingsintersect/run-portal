import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const FancyInput = forwardRef((props, ref) => {
   const inputRef = useRef<HTMLInputElement>(null);

   useImperativeHandle(ref, () => ({
      focus: () => {
         inputRef.current?.focus();
      },
      clear: () => {
         if (inputRef.current) {
            inputRef.current.value = '';
         }
      },
   }));

   return <input ref={inputRef} {...props} />;
});

FancyInput.displayName = 'FancyInput';
export default FancyInput;

export const App = () => {
   // Create a ref to access the FancyInput methods
   const fancyInputRef = useRef<HTMLInputElement>(null);

   // Function to focus the input
   const handleFocus = () => {
      fancyInputRef.current?.focus();
   };

   // Function to clear the input
   const handleClear = () => {
      fancyInputRef.current//?.clear();
   };

   return (
      <div>
         <FancyInput ref={fancyInputRef} />

         <button onClick={handleFocus}>Focus the input</button>
         <button onClick={handleClear}>Clear the input</button>
      </div>
   );
};
