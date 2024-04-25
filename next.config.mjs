/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		missingSuspenseWithCSRBailout: false,
		serverComponentsExternalPackages: ["@react-pdf/renderer"],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.imagin.studio",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.shareicon.net",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "mystage-static.starter.ro",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
