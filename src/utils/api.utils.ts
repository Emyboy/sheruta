import { FUNCTION_URL } from '@/constants'
import axios, { AxiosRequestConfig } from 'axios'

export const apiCall = ({
	route,
	options,
}: {
	route: string
	options?: AxiosRequestConfig
}) => {
	return axios(FUNCTION_URL + route, {
		...options,
	})
}
