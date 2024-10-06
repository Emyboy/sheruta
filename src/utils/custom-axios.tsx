import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
})
export default axiosInstance
