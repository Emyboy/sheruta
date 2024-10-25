import axios, { AxiosInstance } from 'axios'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

const useAuthenticatedAxios = (): AxiosInstance => {
	const { data: session, status } = useSession()

	// Use useMemo to return a stable axios instance only when the session is ready
	const axiosInstance = useMemo(() => {
		// If the session is still loading, return null to avoid making requests
		// if (status === 'loading' || !session?.token) return null

		// Create the axios instance once the session is ready
		const instance = axios.create({
			baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
		})

		// Add token to the Authorization header
		instance.interceptors.request.use((config) => {
			if (session?.token) {
				config.headers['Authorization'] = `Bearer ${session.token}`
			}
			return config
		})

		return instance
	}, [session, status])

	return axiosInstance
}

export default useAuthenticatedAxios
