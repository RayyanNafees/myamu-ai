import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	outputFileTracingIncludes: {
		"/test/data/05-versions-space.pdf": ["./test/data/05-versions-space.pdf"],
	},
};

export default nextConfig;
