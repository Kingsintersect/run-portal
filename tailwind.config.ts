import type { Config } from "tailwindcss";
import lime from "tailwindcss/colors";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				lime, // this adds all `lime-50` to `lime-900`
			},
		},
	},
	plugins: [],
	future: {
		enableAllExperimentalFeatures: true,
	},
};

export default config;
