"use client";

import { Roles } from "@/config";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";



export interface CreateUserData {
	email: string;
	password: string;
	name?: string;
	role?: Roles;
}
export interface LoginCredentials {
	email: string;
	password: string;
}

export function useAuth() {
	const { data: session, status } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (credentials: LoginCredentials) => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await signIn("credentials", {
				email: credentials.email,
				password: credentials.password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid credentials");
				return { success: false, error: "Invalid credentials" };
			}

			return { success: true };
		} catch {
			const errorMessage = "Login failed";
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	const applyForAdmission = async (userData: CreateUserData) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Registration failed");
				return {
					success: false,
					error: data.error || "Registration failed",
				};
			}

			// Auto-login after registration
			const loginResult = await login({
				email: userData.email,
				password: userData.password,
			});

			return loginResult;
		} catch {
			const errorMessage = "Registration failed";
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await signOut({ redirect: false });
		} finally {
			setIsLoading(false);
		}
	};

	return {
		user: session?.user || null,
		isAuthenticated: !!session,
		isLoading: status === "loading" || isLoading,
		error,
		login,
		applyForAdmission,
		logout,
		clearError: () => setError(null),
	};
}
