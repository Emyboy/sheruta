import { FUNCTION_URL } from '@/constants'
import { RequestInit } from 'next/dist/server/web/spec-extension/request'

export const apiCall = async ({
	route,
	options,
}: {
	route: string
	options?: RequestInit
}) => {
	const url = FUNCTION_URL + route

	const fetchOptions: RequestInit = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
	}

	try {
		const response = await fetch(url, fetchOptions)
		// if (!response.ok) {
		//   throw new Error(`HTTP error! status: ${response.status}`);
		// }
		return await response.json()
	} catch (error) {
		console.error('Fetch error: ', error)
		throw error
	}
}
