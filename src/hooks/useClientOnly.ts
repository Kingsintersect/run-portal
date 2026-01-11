"use client";
import { ensureClient } from "@/lib/ensureClient";
import { useEffect } from "react";

export const useClientOnly = () => {
	useEffect(() => {
		ensureClient();
	}, []);
};
