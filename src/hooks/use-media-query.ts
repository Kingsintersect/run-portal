import { useState, useEffect } from "react";

/**
 * Custom hook to check if a given media query matches the current viewport.
 * @param {string} query - The media query string (e.g., "(min-width: 768px)")
 * @returns {boolean} - `true` if the query matches, otherwise `false`
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure it's running in the browser

        const mediaQueryList = window.matchMedia(query);

        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Listen for changes
        mediaQueryList.addEventListener("change", handleChange);

        // Set initial state
        setMatches(mediaQueryList.matches);

        // Cleanup on unmount
        return () => mediaQueryList.removeEventListener("change", handleChange);
    }, [query]);

    return matches;
}
