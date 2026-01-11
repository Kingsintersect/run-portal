import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

const AuthSection = ({ classList, children, title, subtitle }: { classList?: string, children: ReactNode, title: string, subtitle?: string }) => {
	return (
		<section className={cn(`w-full h-screen overflow-hidden flex flex-col items-center`, classList)}>
			<div className="w-[80vw] mx-auto h-[80vh] my-auto grid grid-cols-3 shadow-lg bg-gray-100">
				<div className="left cpl-span-1 h-full w-full  bg-cover bg-center bg-no-repeat hidden md:block" style={{ backgroundImage: `url('/bg/student2.png')` }}></div>
				<div className="right col-span-3 md:col-span-2 h-auto w-full my-10 overflow-y-scroll px-7">
					<h1 className="text-xl font-bold leading-tight tracking-tight text-orange-800 md:text-4xl">
						{title}
					</h1>
					<p className="text-lg text-gray-600 mt-5 indent-1">{subtitle}</p>
					{children}
				</div>
			</div>
		</section>
	)
}

export default AuthSection