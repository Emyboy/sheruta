/** @type {import('next').NextConfig} */

// const withPWA = require('next-pwa')({
// 	dest: 'public',
// 	register: true,
// 	sw: '/firebase-messaging-sw.js',
// 	disableDevLogs: true,
// })

const nextConfig = {
	// images: {
	// 	domains: ['lh3.googleusercontent.com'],
	// },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
	},
}

module.exports = nextConfig
