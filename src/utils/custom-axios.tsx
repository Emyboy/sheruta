import axios from 'axios'
import { serverSession } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
axiosInstance.interceptors.request.use(
	async (config) => {
		const session = await serverSession()

		if (session?.token) {
			config.headers['Authorization'] = `Bearer ${session.token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

export default axiosInstance
