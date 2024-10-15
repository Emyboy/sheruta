import axios, { AxiosInstance } from 'axios'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

const useAuthenticatedAxios = (): AxiosInstance => {
	const { data: session } = useSession()

	const axiosInstance = useMemo(() => {
		const instance = axios.create({
			baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
		})

		instance.interceptors.request.use((config) => {
			if (session?.token) {
				config.headers['Authorization'] = `Bearer ${session.token}`
			}
			return config
		})

		return instance
	}, [session])

	return axiosInstance
}

export default useAuthenticatedAxios
