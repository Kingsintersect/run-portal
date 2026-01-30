import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		serverActions: {
			bodySizeLimit: '20mb', //increasing the body size limit for server actions
		},
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "redeemers-university.qverselearning.org",
				pathname: "**",
			},
			{
				protocol: "http",
				hostname: "redeemers-university.qverselearning.org",
				pathname: "**",
			},
		],
	},
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
					exclude: ["error", "warn"],
				}
				: false,
	},
	async headers() {
		return [
			{
				// match all api routes
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						// Add multipart-specific headers
						value: [
							"X-CSRF-Token",
							"X-Requested-With",
							"Accept",
							"Accept-Version",
							"Content-Length",
							"Content-MD5",
							// Critical for FormData:
							"Content-Type",
							"Authorization",
							"Date",
							"X-Api-Version"
						].join(", "),
					},
				],
			},
		];
	},
};

export default nextConfig;
