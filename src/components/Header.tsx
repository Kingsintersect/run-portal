"use client";
import React from "react";
import { Power, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

const Header = () => {
	const { user, initializeLogout, updateUserInState, refreshUserData } = useAuth();
	return (
		<header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						{/* <h1 className="text-2xl font-bold text-blue-600">UniPortal</h1> */}
						{/* <div
							className="text-3xl font-bold text-site-a hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
						> */}
						<div className="relative h-20 w-40">
							<Image
								src={`/logo/logo.jpg`}
								alt="LOGO IMAGE"
								fill
								className="object-contain"
							/>
						</div>
						{/* </div> */}
					</div>
					<div className="flex items-center space-x-4">
						{user &&
							<div className="flex items-center space-x-3">
								<div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
									<User className="h-5 w-5 text-gray-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">{user?.first_name}</span>

								<Button className="flex items-center space-x-1 bg-transparent border-none shadow-none hover:bg-gray-800/10" onClick={async () => {
									await initializeLogout();
									updateUserInState(null);
									refreshUserData();
								}}>
									<span className="text-sm font-medium text-gray-700">Sign Out</span>
									<div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
										<Power className="h-5 w-5 text-gray-600" />
									</div>
								</Button>
							</div>
						}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
