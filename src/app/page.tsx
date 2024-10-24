import { CACHE_TTL } from '@/constants'
import { FlatShareRequest } from '@/firebase/service/request/request.types'
import axiosInstance from '@/utils/custom-axios'
import HomePage from './(home-page)/home-page'

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
	} = await axiosInstance.get(
		`/flat-share-requests?page=${searchParams?.page || 1}&limit=30`,
	)

	return <HomePage requests={requests} userProfiles={'[]'} />
}
