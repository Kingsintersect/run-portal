
"use client";

import {cn}from "@/lib/utils";
import { SearchCheck } from "lucide-react";
import { Input } from "../input";
import { Button } from "../button";

interface SearchProps {
   name: string;
   placeholder ?: string;
   classList?: string;
   className?: string;
   value?: string;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ name, placeholder, classList,className, value, onChange }: SearchProps) => {
   return (
      <div className={cn("flex w-full max-w-sm items-center space-x-1", classList)}>
         <Input
            type="text"
            name={name}
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={onChange}
         />
         <Button variant="outline" size="icon" color="#23628d">
            <SearchCheck />
         </Button>
    </div>
   );
}

export default Search