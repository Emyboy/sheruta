import { CACHE_TTL } from '@/constants'
import { FlatShareRequest } from '@/firebase/service/request/request.types'
import HomePage from './(home-page)/home-page'
import axiosInstance from '@/utils/custom-axios'

export const revalidate = CACHE_TTL?.SHORT

export const dynamic = 'force-dynamic'

type Props = {
	searchParams?: { [key: string]: string | undefined }
}

export default async function page({ searchParams }: Props) {
	const {
		data: { data: requests },
	}: {
		data: {
			data: FlatShareRequest[]
		}
	} = await axiosInstance.get(`/flat-share-requests?page=1&limit=10`)

	const finalRequests =
		requests && Object.keys(requests).length > 0 ? requests : undefined

	return <HomePage requests={finalRequests} userProfiles={'[]'} />
}
