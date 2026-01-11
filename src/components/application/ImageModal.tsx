
"use client";

import { ReactNode } from "react";
import Image from 'next/image';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"


export function ImageModal({ img_url, children }: { img_url: string, children: ReactNode }) {

	if (!img_url) return <>{children}</>

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className="max-w-none w-[80%] p-6 overflow-auto"
				style={{ maxWidth: '80%', width: '75%' }}
			>
				<DialogHeader>
					<DialogTitle>Image View</DialogTitle>
				</DialogHeader>
				<div className="relative w-full h-[80vh]">
					<Image
						src={img_url}
						fill
						style={{ objectFit: "contain" }}
						alt="Certificate image"
						onError={(e) => {
							console.error("Image failed to load:", img_url);
							e.currentTarget.src = "/emptystate/notfound2.jpg";
						}}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
