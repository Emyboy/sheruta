/** @type {import('next').NextConfig} */
const nextConfig = {
	// images: {
	// 	domains: ['lh3.googleusercontent.com'],
	// },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'googleusercontent.com',
				// port: '',
				// pathname: '/account123/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				// port: '',
				// pathname: '/account123/**',
			},
		],
	},
}

module.exports = nextConfig
